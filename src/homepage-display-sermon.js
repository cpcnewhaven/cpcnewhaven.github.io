document.addEventListener('DOMContentLoaded', function() {
  fetch('data/podcast-index.json')
    .then(response => response.json())
    .then(data => {
      const sundaySermons = data.sundaySermons.episodes;
      const latestSermon = sundaySermons.reduce((latest, sermon) => {
        return new Date(sermon.date) > new Date(latest.date) ? sermon : latest;
      }, sundaySermons[0]);

      if (latestSermon) {
        const primaryListenUrl = latestSermon.link || latestSermon.audio_url || '#';
        const spotifyLikeUrl = latestSermon.spotify_url || latestSermon.audio_url || latestSermon.link || 'https://open.spotify.com';
        const appleLikeUrl = latestSermon.apple_podcasts_url || latestSermon.audio_url || latestSermon.link || 'https://podcasts.apple.com';

        document.getElementById('sermonTitle').textContent = latestSermon.title || 'Sermon Title';
        document.getElementById('sermonScripture').textContent = latestSermon.scripture || 'Scripture';

        // Update the link and image for the latest sermon
        const latestSermonLink = document.getElementById('latestSermonLink');
        latestSermonLink.href = primaryListenUrl;
        const sermonImage = latestSermonLink.querySelector('.podcast-thumbnail');
        sermonImage.src = latestSermon['podcast-thumbnail_url'] || 'default-image.jpg';
        sermonImage.alt = latestSermon.title || 'Sermon Image';

        // Update other links
        document.getElementById('sermonSpotify').href = spotifyLikeUrl;
        document.getElementById('sermonApple').href = appleLikeUrl;
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
