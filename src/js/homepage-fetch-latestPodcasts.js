
document.addEventListener('DOMContentLoaded', function() {
  fetch('data/podcast/total-podcast.json')
    .then(response => response.json())
    .then(data => {
      updatePodcastSection(data);
    })
    .catch(error => console.error('Error loading podcast data:', error));
});

function updatePodcastSection(podcasts) {
  // Sort podcasts by publishedDate in descending order
  podcasts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  // Select the last three podcasts
  const latestPodcasts = podcasts.slice(0, 3);

  // Find the table body in the podcast section
  const tableBody = document.querySelector('#podcasts tbody');
  tableBody.innerHTML = ''; // Clear existing content

  // Generate and append new rows for each of the latest podcasts
  latestPodcasts.forEach(podcast => {
    const row = document.createElement('tr');

    // Assuming 'Date' column will use 'publishedDate' and 'Series' will use 'series'
    // Modify as needed for your actual data structure
    row.innerHTML = `
      <td>${new Date(podcast.publishedDate).toLocaleDateString()}</td>
      <td>${podcast.series.toUpperCase()}</td>
      <td>Dynamic Passage</td> <!-- Placeholder, adjust as needed -->
      <td>${podcast.title}</td>
      <td><a href="${podcast.episodeLink}" target="_blank">Listen on Spotify</a></td>
      <td><a href="#" target="_blank">Listen on Apple</a></td> <!-- Placeholder for Apple link -->
    `;

    tableBody.appendChild(row);
  });
}
