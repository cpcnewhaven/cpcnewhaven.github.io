# Dead End Features Report - RESOLVED

## ✅ Fixed Issues

### 1. `data/upcomingSermon.json` - CREATED
- **Status:** ✅ FIXED
- **Action Taken:** Created the missing JSON file with proper structure
- **File Created:** `data/upcomingSermon.json`
- **Structure:** Array of sermon objects with fields: active, status, title, scripture, date, author, youtube_url, bulletin_url, spotify_url, apple_podcasts_url

### 2. `old-home.html` - ARCHIVED
- **Status:** ✅ FIXED
- **Action Taken:** Moved to `archive/old-home.html`
- **References Updated:** 
  - Removed from `scripts/build-search-index.py` skip list
  - Updated comment in `index.html` to reflect archive location

### 3. `comm2.html` - ARCHIVED
- **Status:** ✅ FIXED
- **Action Taken:** Moved to `archive/comm2.html`

### 4. `new-about.html` - ARCHIVED
- **Status:** ✅ FIXED
- **Action Taken:** Moved to `archive/new-about.html`
- **References Updated:** 
  - Removed from `scripts/build-search-index.py` about page checks
  - Removed from long-form boost logic

## Summary

All dead end features have been resolved:
- ✅ Missing JSON file created
- ✅ Orphaned HTML files archived
- ✅ All references updated in codebase
- ✅ No broken links or missing file references remain
