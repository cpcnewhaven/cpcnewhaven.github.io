# Retreat 2025 Photo Gallery System

This document explains how to manage the Retreat 2025 photo gallery on the CPC New Haven website.

## Overview

The gallery system allows community members to upload photos to a Google Drive folder, which are then displayed dynamically on the `retreat2025.html` page. The system includes:

- **Public Gallery**: Displays photos on the website
- **Upload Link**: Directs users to the Google Drive folder for uploading
- **Admin Tools**: Tools for managing the gallery content

## Files Structure

```
├── retreat2025.html                    # Main gallery page
├── src/js/retreat2025-dynamic.js      # Gallery display logic
├── data/retreat2025-images.json       # Gallery data (images list)
├── admin/retreat-gallery-admin.html   # Admin interface
└── scripts/update-retreat-gallery.js  # Command-line tool
```

## How It Works

1. **Upload Photos**: Community members upload photos to the Google Drive folder
2. **Add to Gallery**: Admin adds the photos to the gallery using the admin tools
3. **Display**: Photos are automatically displayed on the website

## Google Drive Setup

The gallery uses this Google Drive folder:
- **URL**: https://drive.google.com/drive/folders/1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW
- **Access**: Anyone with the link can view and upload
- **Permissions**: Set to "Anyone with the link can view"

## Adding Photos to the Gallery

### Method 1: Using the Admin Interface (Recommended)

1. Open `admin/retreat-gallery-admin.html` in a web browser
2. Go to the Google Drive folder and right-click on an image
3. Select "Get link" and copy the share URL
4. Paste the URL in the admin form and add a description
5. Click "Add Image"

### Method 2: Using the Command Line Tool

1. Open terminal in the project directory
2. Run: `node scripts/update-retreat-gallery.js`
3. Follow the prompts to add images

### Method 3: Manual JSON Editing

1. Open `data/retreat2025-images.json`
2. Add image objects to the `images` array:

```json
{
  "url": "https://drive.google.com/uc?export=view&id=FILE_ID",
  "name": "Description of the photo",
  "addedAt": "2025-01-27T00:00:00.000Z"
}
```

## Converting Google Drive URLs

Google Drive share URLs need to be converted to direct image URLs:

**From**: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
**To**: `https://drive.google.com/uc?export=view&id=FILE_ID`

The admin tools automatically handle this conversion.

## Gallery Features

- **Responsive Design**: Works on desktop and mobile
- **Lightbox**: Click images to view full-size
- **Lazy Loading**: Images load as needed for better performance
- **Error Handling**: Shows appropriate messages for missing images
- **Empty State**: Encourages photo uploads when gallery is empty

## Troubleshooting

### Images Not Loading
- Check that the Google Drive URL is correct
- Ensure the image is publicly accessible
- Verify the URL conversion (share URL → direct URL)

### Admin Interface Not Working
- Make sure you're running a local server (the admin page needs to make HTTP requests)
- Check browser console for error messages
- Ensure the data file exists and is valid JSON

### Gallery Not Updating
- Clear browser cache
- Check that the JSON file was saved correctly
- Verify the JavaScript file is loading without errors

## Best Practices

1. **Image Descriptions**: Use descriptive names for photos
2. **File Sizes**: Keep images under 5MB for better loading
3. **Regular Updates**: Add new photos regularly to keep the gallery fresh
4. **Quality Control**: Review photos before adding to ensure they're appropriate
5. **Backup**: Keep a backup of the JSON file

## Technical Notes

- The gallery uses vanilla JavaScript (no external dependencies)
- Images are loaded asynchronously for better performance
- The system is designed to work with static hosting (GitHub Pages)
- No server-side processing is required

## Support

For technical issues or questions about the gallery system, contact the website administrator.
