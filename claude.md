# Claude Code Session Notes

## Project Overview
Church website for CPC New Haven (cpcnewhaven.github.io)

## Recent Changes

### 2026-01-28: Removed Inclement Weather Announcement
- Removed the snow/weather warning banner from `index.html` (was around lines 131-147)

### 2026-01-28: Added Preston Graham to Staff
- Added Preston Graham as "Pastor Emeritus" to the Staff section in `about.html`
- Positioned after the two current pastors (Craig Luekens and Jerry Ornelas)
- No about.json file exists - staff data is hard-coded in HTML
- User will provide additional description text later

## Key Files
- `about.html` - Main about page with staff section (lines ~838-900)
- Staff are listed in a grid using `.about-staff-grid` and `.about-staff-member` classes
- No `data/about.json` exists (referenced in fetch-about.js but not created)

## Notes
- Staff section uses hard-coded HTML, not JSON
- Pastors have "Meet Pastor X" buttons linking to individual pages (e.g., pastor-craig.html)
- Preston Graham currently has no individual page or button - can be added if needed
