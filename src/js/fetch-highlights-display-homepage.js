document.addEventListener('DOMContentLoaded', function() {
    fetch('data/announcements/highlights.json')
        .then(response => response.json())
        .then(data => {
            const highlightsContainer = document.getElementById('highlights');
            
            // Separate superFeatured announcements that are active
            const superFeaturedAnnouncements = data.announcements.filter(announcement => announcement.tag === "superFeatured" && announcement.active === "true");
            
            // Separate other announcements that are active
            const otherAnnouncements = data.announcements.filter(announcement => announcement.tag !== "superFeatured" && announcement.active === "true");

            // Function to create announcement elements
            const createAnnouncementElement = (announcement) => {
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

                // Add special styling for superFeatured
                if (announcement.tag === "superFeatured") {
                    highlightElement.classList.add('super-featured');
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

                // Remove color styling for upcoming and ongoing events
                if (announcement.type === "upcoming" || announcement.type === "ongoing") {
                    highlightElement.style.color = ''; // Reset color
                }

                return highlightElement;
            };

            // Display superFeatured announcements first
            superFeaturedAnnouncements.forEach(announcement => {
                const element = createAnnouncementElement(announcement);
                highlightsContainer.appendChild(element);
            });

            // Display other announcements
            otherAnnouncements.forEach(announcement => {
                const element = createAnnouncementElement(announcement);
                highlightsContainer.appendChild(element);
            });
        })
        .catch(error => console.error('Error loading highlights:', error));
});

document.addEventListener('scroll', function() {
    const splashImage = document.querySelector('.splash-image::before');
    const scrollPosition = window.scrollY;
    splashImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

// Add CSS for superFeatured styling
const style = document.createElement('style');
style.innerHTML = `
    .super-featured {
        border: 2px solid gold;
        padding: 10px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
    }
`;
document.head.appendChild(style);
