/**
 * Google Drive Gallery Updater
 * 
 * This script helps update the retreat gallery with new images from Google Drive
 */

// Example file IDs from the Google Drive folder
// Replace these with actual file IDs extracted from your Google Drive folder
const SAMPLE_FILE_IDS = [
    // These are placeholder IDs - replace with real ones from your Google Drive folder
    // To get real file IDs, use the gdrive-file-extractor.html tool
];

function generateGalleryData(fileIds) {
    return {
        images: fileIds.map(fileId => ({
            id: fileId,
            url: `https://drive.google.com/uc?export=view&id=${fileId}`,
            name: `Retreat Photo ${fileId.substring(0, 8)}`,
            uploaded: new Date().toISOString()
        }))
    };
}

function updateRetreatGallery(fileIds) {
    const galleryData = generateGalleryData(fileIds);
    
    console.log('Generated gallery data:', galleryData);
    
    // In a real implementation, you would save this to the JSON file
    // For now, we'll just log it and provide instructions
    
    console.log('\n=== INSTRUCTIONS ===');
    console.log('1. Copy the JSON data above');
    console.log('2. Save it to: data/retreat2025-images.json');
    console.log('3. The gallery will automatically load the new images');
    
    return galleryData;
}

// Function to extract file IDs from Google Drive folder (run this in browser console)
function extractFileIdsFromGoogleDrive() {
    const fileIds = [];
    
    // Try multiple selectors to find file elements
    const selectors = [
        '[data-id]',
        '[data-target-id]',
        '[data-file-id]',
        '.goog-drive-picker-item[data-id]',
        '.goog-drive-picker-item[data-target-id]'
    ];
    
    selectors.forEach(selector => {
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
    
    // Also try to extract from the page source
    const pageSource = document.documentElement.outerHTML;
    const idRegex = /"id":"([a-zA-Z0-9_-]{20,})"/g;
    let match;
    while ((match = idRegex.exec(pageSource)) !== null) {
        if (!fileIds.includes(match[1])) {
            fileIds.push(match[1]);
        }
    }
    
    console.log('Found file IDs:', fileIds);
    
    if (fileIds.length > 0) {
        const galleryData = updateRetreatGallery(fileIds);
        
        // Copy to clipboard if possible
        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(galleryData, null, 2))
                .then(() => console.log('JSON copied to clipboard!'))
                .catch(err => console.log('Could not copy to clipboard:', err));
        }
    } else {
        console.log('No file IDs found. Make sure you are on the Google Drive folder page.');
    }
    
    return fileIds;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateGalleryData,
        updateRetreatGallery,
        extractFileIdsFromGoogleDrive
    };
}