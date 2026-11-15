#!/usr/bin/env python3
"""Fill missing Sunday sermon artwork from Spotify's public oEmbed metadata.

Spotify artwork is downloaded into assets/sermon-thumbnails so the site does
not depend on Spotify's image CDN at runtime. Existing/manual thumbnails are
left untouched.
"""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/sunday-sermons.json"
IMAGE_DIR = ROOT / "assets/sermon-thumbnails"
UA = "CPCNewHavenWebsite/1.0 (+https://cpcnewhaven.org)"


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)


def main():
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    added = skipped = failed = 0
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    for episode in payload.get("episodes", []):
        if episode.get("podcast-thumbnail_url"):
            skipped += 1
            continue
        spotify = episode.get("spotify_url", "")
        if not spotify or "open.spotify.com/episode/" not in spotify:
            failed += 1
            print(f"No Spotify episode URL: {episode.get('date')} {episode.get('title','')}")
            continue
        try:
            endpoint = "https://open.spotify.com/oembed?url=" + urllib.parse.quote(spotify, safe="")
            metadata = get_json(endpoint)
            image_url = metadata.get("thumbnail_url")
            if not image_url:
                raise ValueError("Spotify returned no thumbnail")
            stem = re.sub(r"[^A-Za-z0-9_-]+", "-", episode.get("id") or episode.get("date") or "sermon").strip("-")
            filename = f"{stem}.jpg"
            req = urllib.request.Request(image_url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as response:
                image = response.read()
                content_type = response.headers.get_content_type()
            ext = {"image/png": ".png", "image/webp": ".webp"}.get(content_type, ".jpg")
            if ext != ".jpg":
                filename = f"{stem}{ext}"
            (IMAGE_DIR / filename).write_bytes(image)
            episode["podcast-thumbnail_url"] = f"../assets/sermon-thumbnails/{filename}"
            added += 1
            print(f"Added {episode.get('date')}: {filename}")
            DATA.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        except Exception as exc:
            failed += 1
            print(f"Could not fetch {episode.get('date')}: {exc}")
    DATA.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Finished: {added} added, {skipped} already had artwork, {failed} unavailable/failed.")


if __name__ == "__main__":
    main()
