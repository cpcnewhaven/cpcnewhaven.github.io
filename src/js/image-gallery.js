document.addEventListener("DOMContentLoaded", function() {
    fetch('data/image-gallery.json')
        .then(response => response.json())
        .then(data => {
            const wfbGalleryContainer = document.getElementById('wfb-gallery-container');
            const hcsGalleryContainer = document.getElementById('hcs-gallery-container');
            const miscGalleryContainer = document.getElementById('gallery-container');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');

            data.images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = image.name;
                imgElement.classList.add('gallery-image', 'instagram-style-image');

                imgElement.addEventListener('click', () => {
                    lightbox.style.display = 'flex';
                    lightboxImg.src = image.url;
                });

                if (image.event) {
                    if (image.tags.includes('womens fall brunch')) {
                        wfbGalleryContainer.appendChild(imgElement);
                    } else if (image.tags.includes('hill christmas store 2023')) {
                        hcsGalleryContainer.appendChild(imgElement);
                    }
                } else {
                    miscGalleryContainer.appendChild(imgElement);
                }
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target !== lightboxImg) {
                    lightbox.style.display = 'none';
                }
            });
        })
        .catch(error => console.error('Error loading gallery data:', error));
});
