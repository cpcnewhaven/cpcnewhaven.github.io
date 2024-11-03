document.addEventListener('DOMContentLoaded', function() {
    fetch('data/announcements/highlights.json')
        .then(response => response.json())
        .then(data => {
            const highlightsContainer = document.getElementById('highlights');
            
            // Sort announcements by dateEntered in descending order
            data.announcements.sort((a, b) => new Date(b.dateEntered) - new Date(a.dateEntered));
            
            data.announcements.forEach(announcement => {
                // Check if the announcement is active
                if (announcement.active === "false") {
                    return; // Skip this announcement
                }

                const highlightElement = document.createElement('div');
                highlightElement.classList.add('announcement');
                
                // Add class based on type
                if (announcement.type === "highlight") {
                    highlightElement.classList.add('highlight');
                } else if (announcement.type === "ongoing") {
                    highlightElement.classList.add('ongoing');
                } else if (announcement.type === "upcoming") {
                    highlightElement.classList.add('upcoming');
                }

                // Handle featured image if available
                if (announcement.featuredIMG) {
                    const featuredImage = document.createElement('img');
                    featuredImage.src = announcement.featuredIMG;
                    featuredImage.classList.add('featured-image');
                    featuredImage.style.width = '100%';
                    featuredImage.style.height = '350px';
                    featuredImage.style.objectFit = 'cover';
                    featuredImage.style.marginBottom = '1rem';
                    highlightElement.insertBefore(featuredImage, highlightElement.firstChild);
                }
                // Set background image if available
                else if (announcement.backgroundIMG) {
                    highlightElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${announcement.backgroundIMG})`;
                    highlightElement.style.backgroundSize = 'cover';
                    highlightElement.style.color = '#fff';
                }

                const titleElement = document.createElement('h2');
                titleElement.textContent = announcement.title;
                titleElement.classList.add('announcement-title'); // Add unique class for announcement titles
                highlightElement.appendChild(titleElement);

                // Add date and time as subheader
                if (announcement.date || announcement.time) {
                    const subheaderElement = document.createElement('h3');
                    subheaderElement.textContent = `${announcement.date || ''} ${announcement.time || ''}`.trim();
                    subheaderElement.classList.add('announcement-subheader');
                    highlightElement.appendChild(subheaderElement);
                }

                const descriptionElement = document.createElement('p');
                descriptionElement.innerHTML = announcement.description; // Use innerHTML to render HTML content
                highlightElement.appendChild(descriptionElement);

                highlightsContainer.appendChild(highlightElement);
            });
        })
        .catch(error => console.error('Error loading highlights:', error));
});

document.addEventListener('scroll', function() {
    const splashImage = document.querySelector('.splash-image::before');
    const scrollPosition = window.scrollY;
    splashImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});
