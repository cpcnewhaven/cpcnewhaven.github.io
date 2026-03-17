import json
import re
from datetime import datetime

with open('data/past-services.json', 'r') as f:
    data = json.load(f)

for service in data['services']:
    if service['date'] == 'Unknown Date':
        # Try to find a date like 3.15.26 or 11/1/25 or 10.20.24 in the title
        match = re.search(r'\|\s*(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2}(?:\d{2})?)\s*$', service['title'])
        if match:
            m, d, y = match.groups()
            if len(y) == 2:
                y = "20" + y
            service['date'] = f"{y}-{int(m):02d}-{int(d):02d}"

with open('data/past-services.json', 'w') as f:
    json.dump(data, f, indent=4)
