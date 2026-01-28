# CPC New Haven Website - Claude Code Reference

## Quick Reference

**Tech Stack:** Static HTML + Alpine.js + Vanilla JS + JSON data files
**Hosting:** GitHub Pages
**No build process** - raw HTML/CSS/JS, push to deploy

## Directory Structure

```
/
├── *.html              # 41 static pages (main content)
├── src/css/            # Stylesheets by feature
├── src/js/             # Client-side JavaScript
├── data/               # JSON content files
│   ├── announcements/  # highlights.json, ongoingEvents.json
│   ├── podcasts/       # Series-specific podcast data
│   └── wwb/            # PDF handouts
├── assets/             # Images, logos (~2.5GB, mostly on GCS)
├── scripts/            # Build scripts (Python, JS, shell)
├── admin/              # Internal admin tools
├── archive/            # Old page versions
└── .github/workflows/  # GitHub Actions
```

## Key Files for Common Tasks

| Task | File(s) |
|------|---------|
| Staff/Leadership | `about.html` (lines ~838-1032, hard-coded HTML) |
| Announcements | `data/announcements/highlights.json` |
| Sunday sermons | `data/sunday-sermons.json` |
| Podcasts | `data/podcast-index.json`, `data/podcasts/*.json` |
| Events | `data/events.json` or announcements |
| Homepage content | `index.html` |
| Banner messages | `data/banner-content.json` |
| Search index | `data/search-index.json` (regenerate with `scripts/build-search-index.py`) |

## Content Patterns

**Announcements JSON structure:**
```json
{
  "id": "2026-01-28",
  "title": "...",
  "description": "...",
  "active": true,
  "superfeatured": false,
  "type": "event|announcement|ongoing|upcoming|volunteer",
  "category": "...",
  "featuredImage": "url"
}
```

**Staff HTML structure (in about.html):**
```html
<div class="about-staff-member">
    <h3>Name</h3>
    <h4>Title</h4>
</div>
```

## External Services

- **Podcasts:** Spotify, Apple Podcasts (linked, not hosted)
- **Images:** Google Cloud Storage (`storage.googleapis.com`)
- **Videos:** YouTube embeds
- **Analytics:** Google Analytics (gtag.js)
- **Live streaming:** YouTube Live

## Important Notes

- No CMS - edit JSON/HTML directly
- Cache busting: add `?v=YYYYMMDD` to fetch URLs
- Staff data is hard-coded in HTML, not JSON
- Run `scripts/build-search-index.py` after adding pages
- Images mostly hosted externally (Google Cloud Storage)

## Recent Changes Log

### 2026-01-28
- Added Preston Graham as "Pastor Emeritus" to Staff section in `about.html`
- Removed inclement weather announcement from `index.html`
- Created this claude.md file

---

## Page Quick Reference

**Core:** index, about, sundays, podcasts, events, community, connect, resources, give, live
**Sermons:** sunday-sermons, beyond-podcast
**Education:** classes, adult-sunday-school, walking, total-christ
**Community:** discipleship, lifegroup, membership
**Special:** retreat2025, 2025-missions-trip, congregational-meeting
