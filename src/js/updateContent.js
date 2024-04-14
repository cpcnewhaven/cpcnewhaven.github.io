document.addEventListener('DOMContentLoaded', function() {
    fetch('data/source of truth/upcomingSundays.json')
      .then(response => response.json())
      .then(data => {
        // Existing sermon update logic...
      })
      .catch(error => console.error('Error loading the sermon data:', error));

    // New code to fetch and update podcasts
    fetch('data/podcast/total-podcast.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const podcastsContainer = document.querySelector('#podcasts tbody');
        if (!podcastsContainer) return;

        // Clear existing rows
        podcastsContainer.innerHTML = '';

        // Sort podcasts by publishedDate in descending order and take the latest 3
        const sortedPodcasts = data.podcasts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)).slice(0, 3);

        // Append new rows for each of the latest 3 podcasts
        sortedPodcasts.forEach(podcast => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(podcast.publishedDate).toLocaleDateString()}</td>
            <td>${podcast.series}</td>
            <td>${podcast.passage}</td>
            <td>${podcast.title}</td>
            <td><a href="${podcast.spotifyLink}">Listen on Spotify</a></td>
            <td><a href="${podcast.appleLink}">Listen on Apple</a></td>
          `;
          podcastsContainer.appendChild(row);
        });
      })
      .catch(error => console.error('Error loading the podcasts data:', error));
});
