# Dead End Features Report

## Missing Files Referenced in Code

### 1. `data/upcomingSermon.json` - MISSING
- **Referenced in:**
  - `src/js/live-logic.js` (line 2)
  - `src/js/updateSermonContent.js` (line 2)
- **Impact:** These scripts will fail when trying to fetch sermon data
- **Recommendation:** Either create the file or update the scripts to handle missing data gracefully

## Orphaned/Unused HTML Files

### 2. `old-home.html`
- **Status:** Only mentioned in a comment in `index.html`
- **Description:** Appears to be an old version of the homepage
- **Recommendation:** Archive or delete if no longer needed

### 3. `comm2.html`
- **Status:** Not linked from navigation or other pages
- **Description:** Appears to be an old version of `community.html`
- **Recommendation:** Archive or delete if no longer needed

### 4. `new-about.html`
- **Status:** Only referenced in search index script, not in navigation
- **Description:** Appears to be an old/new version of `about.html`
- **Recommendation:** Archive or delete if no longer needed

## Files to Review

- Check if `old-home.html`, `comm2.html`, and `new-about.html` should be archived or deleted
- Create `data/upcomingSermon.json` or update scripts to handle missing file gracefully

## Summary

**Critical Issues:**
1. Missing `data/upcomingSermon.json` file - causes JavaScript errors on pages using `live-logic.js` and `updateSermonContent.js`

**Orphaned Files (not linked in navigation):**
1. `old-home.html` - old homepage version
2. `comm2.html` - old community page version  
3. `new-about.html` - alternative about page version

**Recommendations:**
- Archive or delete orphaned HTML files if they're no longer needed
- Create the missing `upcomingSermon.json` file or add error handling to the scripts
