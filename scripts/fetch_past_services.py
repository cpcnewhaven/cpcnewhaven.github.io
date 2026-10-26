import json
import subprocess
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAST_SERVICES_PATH = ROOT / "data/past-services.json"
SERMONS_PATH = ROOT / "data/sunday-sermons.json"

def parse_date_from_title(title):
    match = re.search(r'(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2,4})', title)
    if match:
        m, d, y = match.groups()
        y = int(y)
        if y < 100:
            y += 2000
        return f"{y:04d}-{int(m):02d}-{int(d):02d}"
    return None

def build_sermon_lookup():
    lookup = {}
    if SERMONS_PATH.exists():
        try:
            with open(SERMONS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            for ep in data.get("episodes", []):
                sc = ep.get("scripture", "").strip().lower()
                dt = ep.get("date", "").strip()
                if sc and dt:
                    lookup[sc] = dt
        except Exception:
            pass
    return lookup

def fetch_streams():
    cmd = [
        "yt-dlp",
        "--dump-json",
        "--flat-playlist",
        "https://www.youtube.com/@CPCNewHaven/streams"
    ]
    
    print("Running yt-dlp to fetch streams...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    # Load existing to preserve any manually verified dates
    existing_dates = {}
    if PAST_SERVICES_PATH.exists():
        try:
            with open(PAST_SERVICES_PATH, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                for item in existing_data.get("services", []):
                    vid = item.get("id")
                    dt = item.get("date")
                    if vid and dt and dt != "Unknown Date":
                        existing_dates[vid] = dt
        except Exception:
            pass

    sermon_lookup = build_sermon_lookup()
    services = []
    
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        try:
            data = json.loads(line)
            vid_id = data.get('id')
            title = data.get('title') or ""
            url = data.get('url') or f"https://www.youtube.com/watch?v={vid_id}"
            
            thumbnails = data.get('thumbnails', [])
            thumb_url = ""
            if thumbnails:
                thumb_url = thumbnails[-1].get('url', '')
                
            formatted_date = existing_dates.get(vid_id)
            if not formatted_date:
                parsed_from_title = parse_date_from_title(title)
                if parsed_from_title:
                    formatted_date = parsed_from_title
                else:
                    norm_title = re.sub(r'[\s:]+', '', title.lower())
                    for sc, dt in sermon_lookup.items():
                        norm_sc = re.sub(r'[\s:]+', '', sc)
                        if norm_sc in norm_title:
                            formatted_date = dt
                            break

            if not formatted_date:
                date_str = data.get('release_date') or data.get('upload_date')
                if date_str and len(date_str) == 8:
                    formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
                else:
                    formatted_date = "Unknown Date"
            
            services.append({
                "id": vid_id,
                "title": title,
                "url": url,
                "thumbnail": thumb_url,
                "date": formatted_date
            })
        except Exception as e:
            print(f"Error parsing line: {e}")
            
    with open(PAST_SERVICES_PATH, "w", encoding="utf-8") as f:
        json.dump({"services": services}, f, indent=4)
        
    print(f"Successfully saved {len(services)} services to {PAST_SERVICES_PATH}")

if __name__ == "__main__":
    fetch_streams()
