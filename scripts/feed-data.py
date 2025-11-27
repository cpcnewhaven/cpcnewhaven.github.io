import feedparser
import json
from datetime import datetime

RSS_URL = "https://anchor.fm/s/4c59256c/podcast/rss"

# Set this to a specific year if you only want one November
# e.g. 2024 for Nov 2024 only
TARGET_YEAR = None  # e.g. 2024 or None for "all Novembers"
TARGET_MONTH = 11   # November


def get_pub_datetime(entry):
    """Return a datetime object from an RSS entry, or None."""
    if getattr(entry, "published_parsed", None):
        return datetime(*entry.published_parsed[:6])
    if getattr(entry, "updated_parsed", None):
        return datetime(*entry.updated_parsed[:6])
    return None


def extract_link(entry, domain_fragment):
    """Find first link containing domain_fragment."""
    for link in entry.get("links", []):
        href = link.get("href") or ""
        if domain_fragment in href:
            return href
    # Fallback: check entry.link
    href = entry.get("link") or ""
    if domain_fragment in href:
        return href
    return ""


def extract_thumbnail(entry):
    """Try a few common podcast image fields."""
    # Some feeds provide entry.image = {href: "..."} or {url: "..."}
    img = entry.get("image")
    if isinstance(img, dict):
        return img.get("href") or img.get("url") or ""

    # iTunes-style image
    itunes_image = entry.get("itunes_image")
    if isinstance(itunes_image, dict):
        return itunes_image.get("href") or itunes_image.get("url") or ""

    # Fallback: nothing
    return ""


def main():
    feed = feedparser.parse(RSS_URL)

    print(f"Feed title: {feed.feed.get('title', 'Unknown')}")
    print("Processing episodes...\n")

    november_entries = []
    for entry in feed.entries:
        pub = get_pub_datetime(entry)
        if not pub:
            continue

        if pub.month != TARGET_MONTH:
            continue

        if TARGET_YEAR is not None and pub.year != TARGET_YEAR:
            continue

        november_entries.append((pub, entry))

    # Sort by date ascending
    november_entries.sort(key=lambda x: x[0])

    result = []

    for pub, entry in november_entries:
        # id like "24-09-22"
        yy = str(pub.year)[2:]
        episode_id = f"{yy}-{pub.month:02d}-{pub.day:02d}"

        title = entry.get("title", "").strip()
        author = entry.get("author", "").strip() if entry.get("author") else ""

        # URLs
        spotify_url = extract_link(entry, "open.spotify.com")
        apple_podcasts_url = extract_link(entry, "podcasts.apple.com")

        # Thumbnail
        thumbnail_url = extract_thumbnail(entry)

        # Scripture isn't in most feeds, so default to ""
        scripture = ""

        # ISO date
        iso_date = pub.strftime("%Y-%m-%d")

        # If no Spotify URL, fall back to generic link
        link = spotify_url or entry.get("link", "")

        obj = {
            "id": episode_id,
            "title": title,
            "author": author,
            "scripture": scripture,
            "date": iso_date,
            "apple_podcasts_url": apple_podcasts_url,
            "spotify_url": spotify_url,
            "link": link,
            "podcast-thumbnail_url": thumbnail_url,
        }

        result.append(obj)

    # Pretty-print JSON to stdout
    print(json.dumps(result, indent=2, ensure_ascii=False))

    # Optional: also write to file
    with open("november_podcasts.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(result)} November episode(s) to november_podcasts.json")


if __name__ == "__main__":
    main()