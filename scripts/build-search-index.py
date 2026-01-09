#!/usr/bin/env python3
"""
Build a lightweight site-wide search index for CPC New Haven's static site.

Output: data/search-index.json

Design goals:
- No external dependencies (standard library only)
- Index "real" site pages, exclude admin/TO_DELETE/assets-heavy areas
- Extract title + headings + visible body text (skipping nav/header/footer/script/style)
"""

from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable, List, Optional


SKIP_DIR_NAMES = {
    ".git",
    "assets",
    "data",
    "scripts",
    "static",
    "admin",
    "TO_DELETE",
}

SKIP_FILE_NAMES = {
    "archive/index.html",  # generated/legacy index, often very noisy
    # Internal / dev / legacy pages that shouldn't show up in public search
    "a-c-c.html",
    "old-home.html",
    "full-podcast-monte.html",
    "cpc-retreat.html",
}

SKIP_JSON_NAMES = {
    # Generated artifact
    "search-index.json",
    "search-manifest.json",
    # Usually very large/noisy and already represented on the homepage
    "instagram-feed.json",
}


def normalize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())

_TAG_RE = re.compile(r"<[^>]+>")


def strip_html(s: str) -> str:
    # Best-effort: convert <br> to spaces, then drop all remaining tags.
    if not s:
        return ""
    s = s.replace("<br>", " ").replace("<br/>", " ").replace("<br />", " ")
    s = _TAG_RE.sub(" ", s)
    return normalize_ws(s)


def rel_url(root: Path, file_path: Path) -> str:
    return file_path.relative_to(root).as_posix()


def should_skip(root: Path, file_path: Path) -> bool:
    rel = file_path.relative_to(root).as_posix()
    if rel in SKIP_FILE_NAMES:
        return True
    parts = set(file_path.relative_to(root).parts)
    if parts & SKIP_DIR_NAMES:
        return True
    return False


class TextExtractor(HTMLParser):
    """
    Extracts:
    - <title>
    - <meta name="description" content="...">
    - headings h1-h6
    - visible body text (excluding script/style/nav/header/footer)
    """

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._stack: List[str] = []
        self._ignore_depth = 0

        self._in_title = False
        self.title_chunks: List[str] = []
        self.description: Optional[str] = None
        self.headings: List[str] = []
        self.text_chunks: List[str] = []

    @property
    def _current_tag(self) -> Optional[str]:
        return self._stack[-1] if self._stack else None

    def handle_starttag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        tag = tag.lower()
        self._stack.append(tag)

        if tag in {"script", "style", "noscript"}:
            self._ignore_depth += 1
        if tag in {"nav", "header", "footer"}:
            # These contain repeated content (menus/footer links) that pollute search.
            self._ignore_depth += 1

        if tag == "title":
            self._in_title = True

        if tag == "meta":
            attr_map = {k.lower(): (v or "") for k, v in attrs}
            name = attr_map.get("name", "").lower()
            if name == "description":
                content = normalize_ws(attr_map.get("content", ""))
                if content:
                    self.description = content

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        # Pop stack (defensively)
        while self._stack:
            t = self._stack.pop()
            if t == tag:
                break

        if tag == "title":
            self._in_title = False

        if tag in {"script", "style", "noscript"}:
            self._ignore_depth = max(0, self._ignore_depth - 1)
        if tag in {"nav", "header", "footer"}:
            self._ignore_depth = max(0, self._ignore_depth - 1)

    def handle_data(self, data: str) -> None:
        if not data:
            return

        if self._in_title:
            self.title_chunks.append(data)
            return

        if self._ignore_depth > 0:
            return

        tag = self._current_tag
        txt = normalize_ws(data)
        if not txt:
            return

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append(txt)
            # Also include headings in the searchable body text.
            self.text_chunks.append(txt)
            return

        # Visible text
        self.text_chunks.append(txt)


@dataclass
class SearchEntry:
    url: str
    title: str
    description: str
    headings: List[str]
    text: str
    category: str
    updated: str


def categorize(url: str) -> str:
    u = (url or "").lower()
    if u.startswith("sunday-studies/") or u in {"adult-sunday-school.html"}:
        return "Sunday Studies"
    if "podcast" in u or u in {"sunday-sermons.html", "beyond-podcast.html", "classes.html"}:
        return "Podcasts"
    if u in {"resources.html", "forms.html"}:
        return "Resources"
    if u in {"events.html", "announcements.html", "connect.html"}:
        return "Events"
    if u in {"community.html", "lifegroup.html", "get-started-groups.html", "discipleship.html", "membership.html"}:
        return "Community"
    if u in {"media.html", "retreat2025.html"} or "retreat" in u:
        return "Media"
    if u in {"live.html", "live/index.html"}:
        return "Live"
    if u in {"give.html"}:
        return "Give"
    if u in {"about.html", "new-about.html", "pastor-craig.html", "pastor-jerry.html"}:
        return "About"
    return "Other"

def safe_date_like(s: str) -> str:
    # Accept YYYY-MM-DD if present; otherwise return empty
    if not s:
        return ""
    s = str(s).strip()
    return s if re.match(r"^\d{4}-\d{2}-\d{2}$", s) else ""


def is_urlish(s: str) -> bool:
    s = (s or "").strip().lower()
    return s.startswith("http://") or s.startswith("https://")


def iter_json_files(root: Path) -> Iterable[Path]:
    data_dir = root / "data"
    if not data_dir.exists():
        return []
    for p in data_dir.rglob("*.json"):
        if p.name in SKIP_JSON_NAMES:
            continue
        yield p


def json_entries_for_known_files(root: Path, json_path: Path) -> List["SearchEntry"]:
    """
    Turn known JSON content into user-facing search entries that link to real pages.
    """
    rel = rel_url(root, json_path)
    try:
        payload = json.loads(json_path.read_text(encoding="utf-8", errors="ignore"))
    except Exception:
        return []

    out: List[SearchEntry] = []

    def file_updated() -> str:
        try:
            ts = json_path.stat().st_mtime
            return __import__("datetime").datetime.fromtimestamp(ts).date().isoformat()
        except Exception:
            return ""

    def add_entry(url: str, title: str, description: str, text: str, category: Optional[str] = None, updated: str = "") -> None:
        u = url or ""
        out.append(
            SearchEntry(
                url=u,
                title=strip_html(title),
                description=strip_html(description),
                headings=[],
                text=strip_html(text),
                category=category or categorize(u),
                updated=updated or file_updated(),
            )
        )

    # Announcements / highlights
    if rel == "data/announcements/highlights.json" and isinstance(payload, dict):
        for a in (payload.get("announcements") or []):
            if not isinstance(a, dict):
                continue
            add_entry(
                url="announcements.html",
                title=a.get("title", "") or "Announcement",
                description=a.get("description", ""),
                text="tag: " + str(a.get("tag", "") or "") + " • " + str(a.get("category", "") or ""),
                category="Events",
                updated=safe_date_like(a.get("dateEntered", "")) or file_updated(),
            )
        return out

    if rel == "data/announcements/ongoingEvents.json" and isinstance(payload, dict):
        for a in (payload.get("events") or []):
            if not isinstance(a, dict):
                continue
            add_entry(
                url="events.html",
                title=a.get("title", "") or "Ongoing Event",
                description=a.get("description", ""),
                text=str(a.get("date", "") or ""),
                category="Events",
                updated=file_updated(),
            )
        return out

    # Events list
    if rel == "data/events.json" and isinstance(payload, dict):
        for e in (payload.get("events") or []):
            if not isinstance(e, dict):
                continue
            add_entry(
                url="events.html",
                title=str(e.get("date", "") or "Event"),
                description=str(e.get("description", "") or ""),
                text="",
                category="Events",
                updated=file_updated(),
            )
        return out

    # Resources directory
    if rel == "data/resources.json" and isinstance(payload, dict):
        for r in (payload.get("resources") or []):
            if not isinstance(r, dict):
                continue
            url = str(r.get("url", "") or "")
            # Skip internal/admin control center from search results (still indexed via HTML if needed)
            if url.endswith("a-c-c.html"):
                continue
            add_entry(
                url=url if url else "resources.html",
                title=str(r.get("title", "") or "Resource"),
                description=str(r.get("category", "") or ""),
                text="",
                category=categorize(url) if url else "Resources",
                updated=file_updated(),
            )
        return out

    # Site banner content (homepage)
    if rel == "data/banner-content.json" and isinstance(payload, dict):
        banner_text = str(payload.get("bannerText", "") or "")
        button_text = str(payload.get("buttonText", "") or "")
        button_url = str(payload.get("buttonUrl", "") or "")
        add_entry(
            url="index.html",
            title="Site Banner",
            description=banner_text,
            text=" ".join([x for x in [button_text, button_url] if x]),
            category="Other",
            updated=safe_date_like(payload.get("enteredDate", "")) or file_updated(),
        )
        return out

    # Sunday sermons episodes (a lot of real content lives here)
    if rel == "data/sunday-sermons.json" and isinstance(payload, dict):
        for ep in (payload.get("episodes") or []):
            if not isinstance(ep, dict):
                continue
            title = str(ep.get("title", "") or "Sunday Sermon")
            author = str(ep.get("author", "") or "")
            scripture = str(ep.get("scripture", "") or "")
            date = safe_date_like(ep.get("date", "")) or ""
            add_entry(
                url="sunday-sermons.html",
                title=title,
                description=" • ".join([x for x in [author, scripture, date] if x]),
                text="",
                category="Podcasts",
                updated=date or file_updated(),
            )
        return out

    # Beyond podcast episodes
    if rel == "data/beyond-podcast.json" and isinstance(payload, dict):
        for ep in (payload.get("episodes") or []):
            if not isinstance(ep, dict):
                continue
            title = str(ep.get("title", "") or "Beyond episode")
            guest = str(ep.get("guest", "") or "")
            season = str(ep.get("season", "") or "")
            date = safe_date_like(ep.get("date_added", "")) or ""
            add_entry(
                url="beyond-podcast.html",
                title=title,
                description=" • ".join([x for x in [guest, season, date] if x]),
                text="",
                category="Podcasts",
                updated=date or file_updated(),
            )
        return out

    # What We Believe podcast index
    if rel == "data/podcast-index.json" and isinstance(payload, dict):
        series = payload.get("podcastSeries") or {}
        episodes = series.get("episodes") if isinstance(series, dict) else None
        if isinstance(episodes, list):
            for ep in episodes:
                if not isinstance(ep, dict):
                    continue
                title = str(ep.get("title", "") or "What We Believe")
                number = ep.get("number", "")
                add_entry(
                    url="what-we-believe.html",
                    title=(f"What We Believe — {number}. {title}" if number else f"What We Believe — {title}"),
                    description="",
                    text="",
                    category="Sunday Studies",
                    updated=file_updated(),
                )
        return out

    # What We Believe detailed data (includes handout PDFs + better titles)
    if rel == "data/wwb/wwb-data.json" and isinstance(payload, dict):
        episodes = payload.get("episodes") or []
        if isinstance(episodes, list):
            for ep in episodes:
                if not isinstance(ep, dict):
                    continue
                number = ep.get("number", "")
                title = str(ep.get("title", "") or "What We Believe")
                spotify_title = str(ep.get("spotifyTitle", "") or "")
                pdf_url = str(ep.get("pdfUrl", "") or "")
                add_entry(
                    url="what-we-believe.html",
                    title=(f"What We Believe — {number}. {title}" if number else f"What We Believe — {title}"),
                    description=spotify_title,
                    text=pdf_url,
                    category="Sunday Studies",
                    updated=file_updated(),
                )
        return out

    # Class podcast JSONs (data/podcasts/*.json)
    if rel.startswith("data/podcasts/") and isinstance(payload, dict):
        series_title = str(payload.get("title", "") or "Class")
        for ep in (payload.get("episodes") or []):
            if not isinstance(ep, dict):
                continue
            title = str(ep.get("title", "") or series_title)
            number = ep.get("number", "")
            add_entry(
                url="adult-sunday-school.html",
                title=(f"{series_title} — {number}. {title}" if number else f"{series_title} — {title}"),
                description="",
                text="",
                category="Sunday Studies",
                updated=file_updated(),
            )
        return out

    # Media gallery tags (aggregate)
    if rel in {"data/image-gallery.json", "data/retreat2025-images.json"} and isinstance(payload, dict):
        # Avoid indexing every image (too big); instead index unique tags/album names.
        tags = set()
        images = payload.get("images") or []
        if isinstance(images, list):
            for img in images[:2000]:
                if isinstance(img, dict):
                    for t in (img.get("tags") or []):
                        if isinstance(t, str):
                            tags.add(strip_html(t).lower())
        tag_text = ", ".join(sorted([t for t in tags if t and len(t) <= 40])[:120])
        add_entry(
            url="media.html",
            title="Media Gallery",
            description="Searchable tags and albums",
            text=tag_text,
            category="Media",
            updated=file_updated(),
        )
        return out

    return []


def build_entry(root: Path, html_path: Path, max_text_chars: int) -> Optional[SearchEntry]:
    try:
        raw = html_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return None

    parser = TextExtractor()
    try:
        parser.feed(raw)
    except Exception:
        # If parsing fails, skip this file rather than breaking the build.
        return None

    title = normalize_ws(" ".join(parser.title_chunks))
    headings = [h for h in (normalize_ws(x) for x in parser.headings) if h]
    description = normalize_ws(parser.description or "")

    # If missing title, fall back to first heading
    if not title and headings:
        title = headings[0]
    if not title:
        title = rel_url(root, html_path)

    # Build text and aggressively de-duplicate repeated runs
    text = normalize_ws(" ".join(parser.text_chunks))
    # If a page is effectively empty (template stubs / placeholders), skip it.
    if len(text) < 40 and not headings:
        return None
    # Give long-form pages more room (people often search deep within these).
    url = rel_url(root, html_path)
    long_form_boost = 0
    if url in {"about.html", "new-about.html"}:
        long_form_boost = 20000
    if url.startswith("sunday-studies/"):
        long_form_boost = 8000

    effective_max = max_text_chars + long_form_boost
    if len(text) > effective_max:
        text = text[:effective_max].rsplit(" ", 1)[0] + "…"

    category = categorize(url)
    try:
        updated = html_path.stat().st_mtime
        # ISO-ish string is easy to work with on the client.
        updated_str = __import__("datetime").datetime.fromtimestamp(updated).date().isoformat()
    except Exception:
        updated_str = ""

    return SearchEntry(
        url=url,
        title=title,
        description=description,
        headings=headings[:20],
        text=text,
        category=category,
        updated=updated_str,
    )


def iter_html_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*.html"):
        if should_skip(root, path):
            continue
        yield path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="Site root (default: .)")
    ap.add_argument("--out", default="data/search-index.json", help="Output JSON file")
    ap.add_argument("--manifest-out", default="data/search-manifest.json", help="Output manifest JSON file")
    ap.add_argument("--max-text-chars", type=int, default=6000, help="Max text chars per page")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    out_path = (root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path = (root / args.manifest_out).resolve()
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    entries: List[SearchEntry] = []
    for html_path in sorted(iter_html_files(root)):
        entry = build_entry(root, html_path, max_text_chars=args.max_text_chars)
        if entry:
            entries.append(entry)

    # JSON-backed content (events/resources/episodes/etc.)
    for json_path in sorted(iter_json_files(root)):
        entries.extend(json_entries_for_known_files(root, json_path))

    payload = [
        {
            "url": e.url,
            "title": e.title,
            "description": e.description,
            "headings": e.headings,
            "text": e.text,
            "category": e.category,
            "updated": e.updated,
        }
        for e in entries
    ]

    # Stable output
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"), sort_keys=False)
        f.write("\n")

    # Small manifest that documents what's indexed (helpful for debugging + transparency)
    try:
        sources = sorted({rel_url(root, p) for p in iter_json_files(root)})
        manifest = {
            "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
            "entryCount": len(payload),
            "htmlPagesIndexed": len([p for p in iter_html_files(root)]),
            "jsonFilesIndexed": sources,
            "notes": [
                "search-index.json is a generated artifact (commit it).",
                "search-manifest.json documents index sources; safe to commit.",
            ],
        }
        with manifest_path.open("w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, separators=(",", ":"), sort_keys=False)
            f.write("\n")
    except Exception:
        # Don't fail builds over manifest.
        pass

    print(f"Wrote {len(payload)} entries to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

