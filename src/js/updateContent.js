document.addEventListener('DOMContentLoaded', function() {
    fetch('data/source of truth/upcomingSundays.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const activeSermon = data.sermons.find(sermon => sermon.isActive);

        if (activeSermon) {
          // Safely update elements if they exist
          const updateTextContent = (selector, text) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = text;
          };

          updateTextContent('#worship h1', activeSermon.title);
          updateTextContent('#worship h2', activeSermon.serviceTime);
          updateTextContent('#worship h3', activeSermon.upcomingSermonTitle);
          updateTextContent('#worship .sermon-details', activeSermon.sermonDetails);
          updateTextContent('#pastorName', activeSermon.pastorName);
          updateTextContent('#bookTitle', activeSermon.bookTitle);

          // Show separator if both pastorName and bookTitle are present
          const separator = document.querySelector('#separator');
          if (separator) {
            separator.style.display = (activeSermon.pastorName && activeSermon.bookTitle) ? 'inline' : 'none';
          }
        } else {
          const worshipSection = document.querySelector('#worship');
          if (worshipSection) worshipSection.style.display = 'none';
        }
      })
      .catch(error => console.error('Error loading the sermon data:', error));
});