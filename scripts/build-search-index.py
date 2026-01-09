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


def normalize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


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
    - headings h1-h3
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

        if tag in {"h1", "h2", "h3"}:
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
    if len(text) > max_text_chars:
        text = text[:max_text_chars].rsplit(" ", 1)[0] + "…"

    url = rel_url(root, html_path)
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
    ap.add_argument("--max-text-chars", type=int, default=6000, help="Max text chars per page")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    out_path = (root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    entries: List[SearchEntry] = []
    for html_path in sorted(iter_html_files(root)):
        entry = build_entry(root, html_path, max_text_chars=args.max_text_chars)
        if entry:
            entries.append(entry)

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

    print(f"Wrote {len(payload)} entries to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

