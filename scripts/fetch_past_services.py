import json
import subprocess
import os
import datetime

def fetch_streams():
    cmd = [
        "yt-dlp",
        "--dump-json",
        "--flat-playlist",
        "https://www.youtube.com/@CPCNewHaven/streams"
    ]
    
    print("Running yt-dlp to fetch streams...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    services = []
    
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        try:
            data = json.loads(line)
            # Parse the metadata
            vid_id = data.get('id')
            title = data.get('title')
            url = data.get('url')
            
            # extract best thumbnail
            thumbnails = data.get('thumbnails', [])
            thumb_url = ""
            if thumbnails:
                # usually sorted by quality, get the last one
                thumb_url = thumbnails[-1].get('url', '')
                
            # Date fetching: 'release_date' or from title
            # yt-dlp might have 'upload_date' or 'release_date' (YYYYMMDD)
            date_str = data.get('release_date')
            formatted_date = ""
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
            
    # Output to json
    out_file = "data/past-services.json"
    with open(out_file, "w") as f:
        json.dump({"services": services}, f, indent=4)
        
    print(f"Successfully saved {len(services)} services to {out_file}")

if __name__ == "__main__":
    fetch_streams()
