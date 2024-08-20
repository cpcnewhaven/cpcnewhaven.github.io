document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/image-gallery.json')
        .then(response => response.json())
        .then(data => {
            const galleryContainer = document.getElementById('gallery-container');
            data.images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <div class="image-container">
                        <img src="${image.url}" alt="${image.name}" onclick="openLightbox(${index})">
                    </div>
                    <div class="gallery-item-info">
                        <div class="tags">${image.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}</div>
                        <div class="date">${new Date(image.created).toLocaleDateString()}</div>
                    </div>
                `;
                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => console.error('Error loading gallery:', error));
});

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const images = JSON.parse(localStorage.getItem('galleryImages'));

    lightboxImg.src = images[index].url;
    lightbox.style.display = 'flex';

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});