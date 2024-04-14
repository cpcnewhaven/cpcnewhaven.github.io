document.addEventListener('DOMContentLoaded', function() {
    fetch('data/announcements/highlights.json')
        .then(response => response.json())
        .then(data => {
            const highlightsContainer = document.getElementById('highlights');
            data.announcements.forEach(announcement => {
                const highlightElement = document.createElement('div');
                highlightElement.classList.add('highlight');
                
                const titleElement = document.createElement('h2');
                titleElement.textContent = announcement.title;
                highlightElement.appendChild(titleElement);
                
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = announcement.description;
                highlightElement.appendChild(descriptionElement);
                
                const dateElement = document.createElement('p');
                dateElement.classList.add('highlight-date');
                dateElement.textContent = `Date: ${announcement.dateEntered}`;
                highlightElement.appendChild(dateElement);
                
                highlightsContainer.appendChild(highlightElement);
            });
        })
        .catch(error => console.error('Error loading highlights:', error));
});