# Retreat 2025 Gallery - Google Drive Integration (Static Edition)

This gallery supports pulling images directly from your Google Drive folder using a **static-only approach** perfect for GitHub Pages and other static hosting platforms.

## Overview

The retreat gallery uses a simple, reliable approach to fetch images from Google Drive:

1. **JSON file** with manually extracted file IDs (primary method)
2. **Fallback** with predefined file IDs in the JavaScript

## Quick Start

### Method 1: Using the Gallery Manager Tool (Recommended)

1. Open `admin/gdrive-gallery-manager.html` in your browser
2. Follow the step-by-step instructions to extract file IDs from your Google Drive folder
3. Copy the generated JSON and update `data/retreat2025-images.json`
4. The gallery will automatically load the new images

### Method 2: Manual Extraction

1. Open your Google Drive folder: https://drive.google.com/drive/folders/1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW
2. Open browser developer tools (F12)
3. Go to Console tab
4. Run the extraction script from `scripts/extract-gdrive-file-ids.js`
5. Copy the output and update the JSON file

### Method 3: Manual File ID Entry

1. Open `admin/gdrive-gallery-manager.html`
2. Go to the "Manual Entry" tab
3. Enter file IDs one per line
4. Generate the JSON and update the file

## File Structure

```
├── retreat2025.html                    # Main gallery page
├── src/js/retreat2025-dynamic.js       # Gallery JavaScript
├── data/retreat2025-images.json        # Image data (JSON)
├── admin/
│   ├── gdrive-gallery-manager.html     # Advanced gallery manager tool
│   └── gdrive-file-extractor.html      # Simple file ID extraction tool
├── scripts/
│   ├── extract-gdrive-file-ids.js      # Browser console script
│   └── update-retreat-gallery.js       # Gallery update utilities
```

## How It Works

### Image URL Format

Google Drive images are accessed using this URL format:
```
https://drive.google.com/uc?export=view&id={FILE_ID}
```

### JSON Structure

The `retreat2025-images.json` file should follow this structure:

```json
{
  "images": [
    {
      "id": "FILE_ID_FROM_GOOGLE_DRIVE",
      "url": "https://drive.google.com/uc?export=view&id=FILE_ID_FROM_GOOGLE_DRIVE",
      "name": "Descriptive Name",
      "addedAt": "2025-01-27T00:00:00.000Z"
    }
  ],
  "lastUpdated": "2025-01-27T00:00:00.000Z",
  "totalImages": 1
}
```

## Troubleshooting

### No Images Loading

1. Check that the Google Drive folder is publicly accessible
2. Verify that file IDs are correctly formatted (20+ characters)
3. Ensure the JSON file is valid JSON
4. Check browser console for error messages

### Images Not Displaying

1. Verify the Google Drive file IDs are correct
2. Check that the images are actually image files (JPG, PNG, etc.)
3. Ensure the Google Drive folder permissions allow public viewing

### File ID Extraction Issues

1. Make sure you're on the correct Google Drive folder page
2. Try refreshing the page and running the extraction script again
3. Use the manual entry method in the file extractor tool

## Updating Images

To add new images to the gallery:

1. Upload images to the Google Drive folder
2. Use the file extractor tool to get new file IDs
3. Add the new file IDs to the JSON file
4. Update the `totalImages` count
5. Refresh the gallery page

## Features

- **Automatic loading**: Images load automatically when the page opens
- **Lightbox view**: Click any image to view it in full size
- **Responsive design**: Gallery adapts to different screen sizes
- **Error handling**: Graceful fallbacks when images fail to load
- **Loading states**: Visual feedback during image loading

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires JavaScript enabled
- **Perfect for static hosting** (GitHub Pages, Netlify, Vercel, etc.)

## Security Notes

- Google Drive folder must be publicly accessible
- File IDs are not sensitive information
- No authentication required for public folders
- Images are served directly from Google Drive
- **No server-side dependencies** - works with static hosting

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify the Google Drive folder is accessible
3. Test with a small number of images first
4. Use the file extractor tool to verify file IDs are correct