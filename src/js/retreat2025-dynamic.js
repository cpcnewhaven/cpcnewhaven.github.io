document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  // Google Drive folder ID from the URL
  const GOOGLE_DRIVE_FOLDER_ID = '1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW';

  // Function to create image element
  function createImageElement(imageData) {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.name || 'Retreat 2025 Photo';
    img.loading = 'lazy';
    img.style.cursor = 'pointer';
    
    // Add click handler for lightbox
    img.addEventListener('click', () => {
      lightboxImg.src = imageData.url;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
    
    return img;
  }

  // Function to display loading state
  function showLoadingState() {
    const loading = document.createElement('div');
    loading.className = 'highlight-loading';
    loading.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #007bff; margin-bottom: 20px;"></i>
        <h3>Loading photos...</h3>
        <p>Fetching images from Google Drive folder.</p>
      </div>
    `;
    galleryGrid.parentElement.appendChild(loading);
  }

  // Function to display empty state
  function showEmptyState() {
    const empty = document.createElement('div');
    empty.className = 'highlight-empty';
    empty.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <i class="fas fa-images" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
        <h3>No photos yet!</h3>
        <p>Be the first to share your retreat memories by uploading photos to our Google Drive folder.</p>
        <a href="https://drive.google.com/drive/folders/1zsVPlO7Zdlruu6JyLAjypbMTjMhgkyNW" 
           class="widget-cta-btn" target="_blank" rel="noopener" style="margin-top: 20px; display: inline-block;">
          Upload Photos
        </a>
      </div>
    `;
    galleryGrid.parentElement.appendChild(empty);
  }

  // Function to display error state
  function showErrorState() {
    const error = document.createElement('div');
    error.className = 'highlight-error';
    error.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 20px;"></i>
        <h3>Unable to load photos</h3>
        <p>There was an error loading the gallery. Please try refreshing the page.</p>
        <button onclick="window.refreshGallery()" class="widget-cta-btn" style="margin-top: 20px;">
          Try Again
        </button>
      </div>
    `;
    galleryGrid.parentElement.appendChild(error);
  }

  // Function to clear any existing states
  function clearStates() {
    const existingStates = galleryGrid.parentElement.querySelectorAll('.highlight-loading, .highlight-empty, .highlight-error');
    existingStates.forEach(state => state.remove());
  }

  // Function to convert Google Drive file ID to direct image URL
  function getGoogleDriveImageUrl(fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Function to fetch images from Google Drive (static-only approach)
  async function fetchGoogleDriveImages() {
    // Try to fetch from JSON file with manually extracted file IDs
    try {
      const jsonResponse = await fetch('./data/retreat2025-images.json');
      if (jsonResponse.ok) {
        const data = await jsonResponse.json();
        if (data.images && data.images.length > 0) {
          console.log(`Loaded ${data.images.length} images from JSON file`);
          return data.images;
        }
      }
    } catch (error) {
      console.log('JSON file approach failed, trying manual list...');
    }
    
    // Fallback: Use a predefined list of known file IDs
    return await fetchImagesFromKnownList();
  }

  // Function to fetch images from a predefined list (fallback method)
  async function fetchImagesFromKnownList() {
    // This is a fallback method where we manually maintain a list of file IDs
    // To populate this list:
    // 1. Open the Google Drive folder in your browser
    // 2. Use the extract-gdrive-file-ids.js script to get file IDs
    // 3. Add them to this array
    
    const knownImageIds = [
      // Example file IDs (replace with actual ones from your Google Drive folder):
      // '1ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ567',
      // '2BCD234EFG567HIJ890KLM123NOP456QRS789TUV012WXY345ZAB678',
      // Add more file IDs here as needed
    ];
    
    return knownImageIds.map(fileId => ({
      id: fileId,
      url: getGoogleDriveImageUrl(fileId),
      name: `Retreat Photo ${fileId.substring(0, 8)}`
    }));
  }

  // Function to load images from Google Drive
  async function loadImages() {
    clearStates();
    showLoadingState();
    
    try {
      const images = await fetchGoogleDriveImages();
      
      if (images.length === 0) {
        showEmptyState();
        return;
      }

      // Clear any existing content
      galleryGrid.innerHTML = '';
      
      // Add images to gallery
      images.forEach(imageData => {
        const imgElement = createImageElement(imageData);
        galleryGrid.appendChild(imgElement);
      });

      // Add loading animation for new images
      const allImages = galleryGrid.querySelectorAll('img');
      allImages.forEach(img => {
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        img.addEventListener('error', () => {
          console.warn('Failed to load image:', img.src);
          img.style.display = 'none';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
      });
      
    } catch (error) {
      console.error('Error loading images:', error);
      showErrorState();
    }
  }

  // Load images on page load
  loadImages();

  // Set up lightbox functionality
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      lightbox.classList.remove('show');
      document.body.style.overflow = 'auto'; // Restore scrolling
      lightboxImg.src = '';
    }
  });

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      lightbox.classList.remove('show');
      document.body.style.overflow = 'auto';
      lightboxImg.src = '';
    }
  });

  // Add refresh functionality (optional - can be called manually)
  window.refreshGallery = loadImages;
});
