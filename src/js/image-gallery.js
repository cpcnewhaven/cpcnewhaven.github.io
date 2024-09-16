document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/image-gallery.json')
        .then(response => response.json())
        .then(data => {
            const galleryContainer = document.getElementById('gallery-container');
            localStorage.setItem('galleryImages', JSON.stringify(data.images));
            data.images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <div class="image-container">
                        <img src="${image.url}" alt="${image.name}" onclick="openLightbox(${index})">
                    </div>
                `; // Removed gallery-item-info div to eliminate captions
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

    // Add image counter
    const counter = document.createElement('div');
    counter.className = 'image-counter';
    counter.textContent = `${index + 1} / ${images.length}`;
    lightbox.appendChild(counter);

    document.body.style.overflow = 'hidden';

    // Add zoom functionality
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let start = { x: 0, y: 0 };

    function setTransform() {
        lightboxImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    lightboxImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    });

    lightboxImg.addEventListener('mouseup', () => {
        panning = false;
    });

    lightboxImg.addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (!panning) return;
        pointX = e.clientX - start.x;
        pointY = e.clientY - start.y;
        setTransform();
    });

    lightboxImg.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (scale === 1) {
            scale = 2;
            pointX = (window.innerWidth / 2 - e.clientX) * 2;
            pointY = (window.innerHeight / 2 - e.clientY) * 2;
        } else {
            scale = 1;
            pointX = 0;
            pointY = 0;
        }
        setTransform();
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const counter = lightbox.querySelector('.image-counter');
    if (counter) counter.remove();
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset zoom and position
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.style.transform = 'translate(0px, 0px) scale(1)';
}

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});