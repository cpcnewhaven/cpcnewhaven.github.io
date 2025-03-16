// Fetch the JSON data from yearbook.json
fetch('yearbook.json')
  .then(response => response.json())
  .then(data => {
    // Gallery element
    const galleryGrid = document.getElementById('galleryGrid');
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Create gallery from JSON data
    data.forEach((image) => {
      const imgElement = document.createElement('img');
      imgElement.src = image.url;
      imgElement.alt = image.id;
  
      // Open lightbox on click
      imgElement.addEventListener('click', () => {
        lightboxImg.src = image.url;
        lightboxImg.alt = image.id;
        lightbox.classList.remove('hidden');
      });
  
      galleryGrid.appendChild(imgElement);
    });
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
  });

// Close lightbox on click outside image
document.getElementById('lightbox').addEventListener('click', (event) => {
  const lightboxImg = document.getElementById('lightbox-img');
  if (event.target !== lightboxImg) {
    document.getElementById('lightbox').classList.add('hidden');
  }
});
