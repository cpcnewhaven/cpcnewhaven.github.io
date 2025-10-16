document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  fetch('./data/retreat2025-images.json')
    .then(r => r.json())
    .then(data => {
      const images = Array.isArray(data.images) ? data.images : [];
      if (images.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'highlight-empty';
        empty.textContent = 'No images yet. Check back soon!';
        galleryGrid.parentElement.appendChild(empty);
        return;
      }
      images.forEach(img => {
        const el = document.createElement('img');
        el.src = img.url;
        el.alt = img.name || 'retreat photo';
        el.loading = 'lazy';
        el.addEventListener('click', () => {
          lightboxImg.src = img.url;
          lightbox.classList.add('show');
        });
        galleryGrid.appendChild(el);
      });
    })
    .catch(() => {
      const err = document.createElement('div');
      err.className = 'highlight-error';
      err.textContent = 'Failed to load images.';
      galleryGrid.parentElement.appendChild(err);
    });

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.classList.remove('show');
      lightboxImg.src = '';
    }
  });
});


