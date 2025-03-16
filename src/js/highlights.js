document.addEventListener('DOMContentLoaded', function() {
    // Set to use local data only
    const useLocalData = true;
    const localDataUrl = './data/announcements/highlights.json';
    const dataUrl = localDataUrl;

    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            const highlightsContainer = document.getElementById('highlights');
            
            // Separate superFeatured announcements that are active
            const superFeaturedAnnouncements = data.announcements
                .filter(announcement => announcement.tag === "superFeatured" && announcement.active === "true")
                .sort((a, b) => {
                    // Extract the numeric portion after the hyphen
                    const idA = parseInt(a.id.split('-')[1]);
                    const idB = parseInt(b.id.split('-')[1]);
                    return idB - idA; // Sort in descending order (highest ID first)
                });
            
            // Separate other announcements that are active
            const otherAnnouncements = data.announcements
                .filter(announcement => announcement.tag !== "superFeatured" && announcement.active === "true")
                .sort((a, b) => {
                    // Extract the numeric portion after the hyphen
                    const idA = parseInt(a.id.split('-')[1]);
                    const idB = parseInt(b.id.split('-')[1]);
                    return idB - idA; // Sort in descending order (highest ID first)
                });

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
                if (announcement.featuredImage) {
                    const featuredImage = document.createElement('img');
                    featuredImage.src = announcement.featuredImage;
                    featuredImage.classList.add('featured-image');
                    featuredImage.style.width = '100%';
                    featuredImage.style.height = 'auto';
                    featuredImage.style.maxHeight = '400px';
                    featuredImage.style.objectFit = 'cover';
                    featuredImage.style.marginBottom = '1rem';
                    if (announcement.featuredImage.length > 400) {
                        featuredImage.style.backgroundAttachment = 'fixed';
                    }
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
        margin-left: 20px;
        margin-right: 10px;
      
    }

    @media (max-width: 768px) {
        .super-featured {
            padding: 20px;
            margin: 15px;
        }
    }
`;
document.head.appendChild(style);
