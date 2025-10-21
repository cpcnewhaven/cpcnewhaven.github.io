/**
 * Google Drive File ID Extractor
 * 
 * This script helps extract file IDs from a Google Drive folder
 * for use in the retreat gallery.
 * 
 * Instructions:
 * 1. Open the Google Drive folder in your browser
 * 2. Open browser developer tools (F12)
 * 3. Go to Console tab
 * 4. Paste this script and run it
 * 5. Copy the output and use it in the gallery
 */

function extractGoogleDriveFileIds() {
  // This function extracts file IDs from the current Google Drive page
  const fileElements = document.querySelectorAll('[data-id]');
  const fileIds = [];
  
  fileElements.forEach(element => {
    const fileId = element.getAttribute('data-id');
    if (fileId && fileId.length > 20) { // Google Drive file IDs are typically long
      fileIds.push(fileId);
    }
  });
  
  // Also try to extract from other possible selectors
  const altSelectors = [
    '[data-target-id]',
    '[data-file-id]',
    '.goog-drive-picker-item[data-id]'
  ];
  
  altSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const fileId = element.getAttribute('data-id') || 
                    element.getAttribute('data-target-id') || 
                    element.getAttribute('data-file-id');
      if (fileId && fileId.length > 20 && !fileIds.includes(fileId)) {
        fileIds.push(fileId);
      }
    });
  });
  
  console.log('Found file IDs:', fileIds);
  console.log('JSON format for gallery:');
  console.log(JSON.stringify(fileIds.map(id => ({
    id: id,
    url: `https://drive.google.com/uc?export=view&id=${id}`,
    name: `Retreat Photo ${id.substring(0, 8)}`
  })), null, 2));
  
  return fileIds;
}

// Run the extraction
extractGoogleDriveFileIds();
