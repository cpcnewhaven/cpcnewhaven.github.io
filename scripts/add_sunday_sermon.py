#!/usr/bin/env python3
"""Add the latest Sunday sermon to the site's data files.

Example:
  python3 scripts/add_sunday_sermon.py \
    --date 2026-10-18 \
    --title 'A Sermon Title | The Sunday Sermon | Acts 3:1-10 | Rev. Craig Luekens' \
    --scripture 'Acts 3:1-10' \
    --author 'Rev. Craig Luekens' \
    --spotify-url 'https://open.spotify.com/episode/…'

The Sunday sermon archive is the source for the homepage Latest Sermons card,
archive page, and What's New card. This command also mirrors the episode into
the podcast index, refreshes current-sermon metadata, and rebuilds site search.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import date
from pathlib import Path
from textwrap import indent
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SERMONS_PATH = ROOT / "data/sunday-sermons.json"
PODCAST_INDEX_PATH = ROOT / "data/podcast-index.json"
CURRENT_SERMON_PATH = ROOT / "data/upcomingSermon.json"
SEARCH_BUILDER_PATH = ROOT / "scripts/build-search-index.py"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", required=True, help="Sermon date (YYYY-MM-DD); must be a Sunday")
    parser.add_argument("--title", required=True, help="Full title as shown in the sermon archive")
    parser.add_argument("--scripture", required=True, help="Scripture reference")
    parser.add_argument("--author", required=True, help="Preacher name")
    parser.add_argument("--spotify-url", default="", help="Spotify episode URL")
    parser.add_argument("--youtube-url", default="", help="YouTube URL")
    parser.add_argument("--apple-podcasts-url", default="", help="Apple Podcasts URL")
    parser.add_argument("--thumbnail-url", default="", help="Podcast thumbnail image URL")
    parser.add_argument("--bulletin-url", default="", help="Bulletin PDF URL for current-sermon metadata")
    parser.add_argument("--dry-run", action="store_true", help="Show the record and target files without writing")
    return parser.parse_args()


def read_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as source:
        return json.load(source)


def make_podcast_episode(args: argparse.Namespace, sermon_id: str) -> dict[str, str]:
    preferred_link = args.spotify_url.strip() or args.youtube_url.strip() or args.apple_podcasts_url.strip()
    return {
        "id": sermon_id,
        "title": args.title.strip(),
        "author": args.author.strip(),
        "scripture": args.scripture.strip(),
        "date": args.date,
        "apple_podcasts_url": args.apple_podcasts_url.strip(),
        "spotify_url": args.spotify_url.strip(),
        "youtube_url": args.youtube_url.strip(),
        "link": preferred_link,
        "podcast-thumbnail_url": args.thumbnail_url.strip(),
        "audio_url": "",
    }


def sermon_title_for_current_record(title: str) -> str:
    marker = " | The Sunday Sermon | "
    return title.split(marker, 1)[0].strip() if marker in title else title.strip()


def updated_sunday_episodes_json(path: Path, episodes: list[dict[str, Any]]) -> str:
    """Return JSON with only the Sunday Sermons array reformatted."""
    raw = path.read_text(encoding="utf-8")
    series_pos = raw.find('"sundaySermons"')
    if series_pos < 0:
        raise ValueError(f'{path.relative_to(ROOT)} has no "sundaySermons" section')
    episodes_pos = raw.find('"episodes"', series_pos)
    array_start = raw.find("[", episodes_pos)
    if episodes_pos < 0 or array_start < 0:
        raise ValueError(f'{path.relative_to(ROOT)} has no Sunday Sermons episode list')

    _, relative_end = json.JSONDecoder().raw_decode(raw[array_start:])
    array_end = array_start + relative_end
    formatted = indent(json.dumps(episodes, ensure_ascii=False, indent=4), "        ")
    return raw[:array_start] + formatted + raw[array_end:]


def main() -> int:
    args = parse_args()
    try:
        sermon_date = date.fromisoformat(args.date)
    except ValueError:
        print("Error: --date must be a real date in YYYY-MM-DD format.", file=sys.stderr)
        return 2
    if sermon_date.isoformat() != args.date:
        print("Error: --date must use the exact YYYY-MM-DD format.", file=sys.stderr)
        return 2

    if sermon_date.isoweekday() != 7:
        print("Error: --date must fall on a Sunday.", file=sys.stderr)
        return 2
    for label, value in (("title", args.title), ("scripture", args.scripture), ("author", args.author)):
        if not value.strip():
            print(f"Error: --{label} cannot be empty.", file=sys.stderr)
            return 2
    if not any((args.spotify_url.strip(), args.youtube_url.strip(), args.apple_podcasts_url.strip())):
        print("Error: provide at least one of --spotify-url, --youtube-url, or --apple-podcasts-url.", file=sys.stderr)
        return 2

    sermon_id = sermon_date.strftime("%y-%m-%d")
    episode = make_podcast_episode(args, sermon_id)
    current_record = {
        "active": True,
        "status": "past",
        "title": sermon_title_for_current_record(args.title),
        "scripture": args.scripture.strip(),
        "date": args.date,
        "author": args.author.strip(),
        "youtube_url": args.youtube_url.strip(),
        "bulletin_url": args.bulletin_url.strip(),
        "spotify_url": args.spotify_url.strip(),
        "apple_podcasts_url": args.apple_podcasts_url.strip(),
    }

    sermons = read_json(SERMONS_PATH)
    podcast_index = read_json(PODCAST_INDEX_PATH)
    current_sermons = read_json(CURRENT_SERMON_PATH)
    canonical_episodes = sermons.get("episodes")
    podcast_episodes = podcast_index.get("sundaySermons", {}).get("episodes")
    if not isinstance(canonical_episodes, list) or not isinstance(podcast_episodes, list) or not isinstance(current_sermons, list):
        print("Error: expected sermon episode arrays were not found in the data files.", file=sys.stderr)
        return 2

    existing_dates = {item.get("date") for item in canonical_episodes if isinstance(item, dict)}
    existing_ids = {
        item.get("id")
        for item in [*canonical_episodes, *podcast_episodes]
        if isinstance(item, dict)
    }
    if args.date in existing_dates or sermon_id in existing_ids:
        print(f"Error: a Sunday sermon dated {args.date} already exists; update that entry manually.", file=sys.stderr)
        return 2

    latest_date = max((item.get("date", "") for item in canonical_episodes if isinstance(item, dict)), default="")
    if latest_date and args.date <= latest_date:
        print(f"Error: {args.date} is not newer than the latest archive entry ({latest_date}).", file=sys.stderr)
        return 2

    canonical_episodes.insert(0, episode)
    podcast_episodes.insert(0, episode.copy())
    current_sermons[:] = [current_record]
    podcast_index_text = updated_sunday_episodes_json(PODCAST_INDEX_PATH, podcast_episodes)
    sermons_text = json.dumps(sermons, ensure_ascii=False, indent=2) + "\n"
    current_sermons_text = json.dumps(current_sermons, ensure_ascii=False, indent=2) + "\n"

    if args.dry_run:
        print(json.dumps(episode, ensure_ascii=False, indent=2))
        print("\nWould update:")
        for path in (SERMONS_PATH, PODCAST_INDEX_PATH, CURRENT_SERMON_PATH, ROOT / "data/search-index.json", ROOT / "data/search-manifest.json"):
            print(f"  {path.relative_to(ROOT)}")
        return 0

    SERMONS_PATH.write_text(sermons_text, encoding="utf-8")
    PODCAST_INDEX_PATH.write_text(podcast_index_text, encoding="utf-8")
    CURRENT_SERMON_PATH.write_text(current_sermons_text, encoding="utf-8")

    result = subprocess.run([sys.executable, str(SEARCH_BUILDER_PATH)], cwd=ROOT, check=False)
    if result.returncode:
        print("Sermon data was written, but search-index generation failed; rerun scripts/build-search-index.py.", file=sys.stderr)
        return result.returncode

    print(f"Added {sermon_id}: {args.title.strip()}")
    print("Updated the sermon archive, podcast index, current-sermon metadata, and search index.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, json.JSONDecodeError, ValueError, KeyError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(2)
