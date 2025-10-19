document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

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
      </div>
    `;
    galleryGrid.parentElement.appendChild(error);
  }

  // Function to load images from JSON file
  function loadImages() {
    fetch('./data/retreat2025-images.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const images = Array.isArray(data.images) ? data.images : [];
        
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
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
        });
      })
      .catch(error => {
        console.error('Error loading images:', error);
        showErrorState();
      });
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
