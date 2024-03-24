document.addEventListener('DOMContentLoaded', function() {
    fetch('data/source of truth/march24.json')
      .then(response => response.json())
      .then(data => {
        // Find the first active sermon
        const activeSermon = data.sermons.find(sermon => sermon.isActive);

        if (activeSermon) {
          // Update the page with the details of the active sermon
          document.querySelector('#worship h1').textContent = activeSermon.title;
          document.querySelector('#worship h2').textContent = activeSermon.serviceTime;
          document.querySelector('#worship h3').textContent = activeSermon.upcomingSermonTitle;
          // Assuming there's a specific <p> element for sermon details
          document.querySelector('#worship .sermon-details').textContent = activeSermon.sermonDetails;
        } else {
          // Hide the section or display a message if no active sermon is found
          document.querySelector('#worship').style.display = 'none';
          // Or display a specific message
          // document.querySelector('#worship').textContent = 'No upcoming sermons at the moment.';
        }
      })
      .catch(error => console.error('Error loading the sermon data:', error));
});