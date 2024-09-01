  document.addEventListener('DOMContentLoaded', function() {
    fetch('data/upcomingSermon.json')
      .then(response => response.json())
      .then(data => {
        const activeSermon = data.find(sermon => sermon.active && sermon.status === 'present');
        if (activeSermon) {
          document.getElementById('sermonSpotify').href = activeSermon.spotify_url || '#';
          document.getElementById('sermonApple').href = activeSermon.apple_podcasts_url || '#';
          document.getElementById('sermonYoutube').href = activeSermon.youtube_url || '#';
          document.getElementById('sermonBulletin').href = activeSermon.bulletin_url || '#';
          document.querySelector('.ag-worship-image').src = activeSermon['podcast-thumbnail_url'] || 'default-image.jpg';
          document.querySelector('.ag-worship-image').alt = activeSermon.title || 'Sermon Image';
          document.getElementById('pastorName').textContent = activeSermon.author || 'Unknown Pastor';
        }
      })
      .catch(error => console.error('Error fetching sermon data:', error));
  });