document.addEventListener('DOMContentLoaded', function() {
  fetch('data/podcast-index.json')
    .then(response => response.json())
    .then(data => {
      const sundaySermons = data.sundaySermons.episodes;
      const latestSermon = sundaySermons.reduce((latest, sermon) => {
        return new Date(sermon.date) > new Date(latest.date) ? sermon : latest;
      }, sundaySermons[0]);

      if (latestSermon) {
        document.getElementById('sermonTitle').textContent = latestSermon.title || 'Sermon Title';
        document.getElementById('sermonScripture').textContent = latestSermon.scripture || 'Scripture';
        document.querySelector('.ag-worship-image').src = latestSermon['podcast-thumbnail_url'] || 'default-image.jpg';
        document.querySelector('.ag-worship-image').alt = latestSermon.title || 'Sermon Image';

        // Update links
        document.getElementById('sermonSpotify').href = latestSermon.spotify_url || 'https://open.spotify.com';
        document.getElementById('sermonApple').href = latestSermon.apple_podcasts_url || 'https://podcasts.apple.com';
        document.getElementById('sermonYoutube').href = latestSermon.youtube_url || 'https://www.youtube.com';

        // Update the image link to the latest sermon
        document.getElementById('sermonLink').href = latestSermon.link || '#';
      }
    })
    .catch(error => console.error('Error fetching sermon data:', error));
});
