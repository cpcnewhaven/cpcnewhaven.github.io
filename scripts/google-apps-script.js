/**
 * Google Apps Script for Google Drive Gallery
 * 
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as web app with "Anyone" access
 * 5. Use the web app URL in your gallery
 */

function doGet(e) {
  const folderId = e.parameter.folderId || '1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW';
  
  try {
    // Get all files from the folder
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    
    const images = [];
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Check if it's an image
      if (mimeType.startsWith('image/')) {
        images.push({
          id: file.getId(),
          name: file.getName(),
          url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
          thumbnail: `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w400`,
          size: file.getSize(),
          lastModified: file.getLastUpdated().toISOString()
        });
      }
    }
    
    // Return JSON response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        images: images,
        count: images.length,
        folderId: folderId
      }, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        images: []
      }, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testScript() {
  const result = doGet({parameter: {folderId: '1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW'}});
  console.log(result.getContent());
}
