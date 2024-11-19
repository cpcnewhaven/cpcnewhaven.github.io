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

        // Update the link and image for the latest sermon
        const latestSermonLink = document.getElementById('latestSermonLink');
        latestSermonLink.href = latestSermon.link || '#';
        const sermonImage = latestSermonLink.querySelector('.podcast-thumbnail');
        sermonImage.src = latestSermon['podcast-thumbnail_url'] || 'default-image.jpg';
        sermonImage.alt = latestSermon.title || 'Sermon Image';

        // Update other links
        document.getElementById('sermonSpotify').href = latestSermon.spotify_url || 'https://open.spotify.com';
        document.getElementById('sermonApple').href = latestSermon.apple_podcasts_url || 'https://podcasts.apple.com';
        document.getElementById('sermonYoutube').href = latestSermon.youtube_url || 'https://www.youtube.com';
      }

      // Fetch and display the latest "Beyond" podcast episode
      const beyondEpisodes = data.beyond.episodes;
      const latestBeyond = beyondEpisodes.reduce((latest, episode) => {
        return new Date(episode.date_added) > new Date(latest.date_added) ? episode : latest;
      }, beyondEpisodes[0]);

      if (latestBeyond) {
        const beyondLink = document.querySelector('.beyond-podcast-link');
        const beyondImage = document.querySelector('.beyond-podcast-thumbnail');

        beyondLink.href = latestBeyond.link || '#';
        beyondImage.src = latestBeyond['podcast-thumbnail_url'] || 'default-beyond-image.jpg';
        beyondImage.alt = latestBeyond.title || 'Beyond Podcast Image';
      }
    })
    .catch(error => console.error('Error fetching sermon data:', error));
});
