document.addEventListener('DOMContentLoaded', function() {
  fetch('./data/upcomingSermon.json')
    .then(response => response.json())
    .then(data => {
      const activeSermon = data.find(sermon => sermon.active);
      if (activeSermon) {
        const sermonTitle = document.getElementById('sermonTitle');
        const sermonScripture = document.getElementById('sermonScripture');
        const sermonDate = document.getElementById('sermonDate');
        const pastorName = document.getElementById('pastorName');
        const sermonYoutube = document.getElementById('sermonYoutube');
        const sermonBulletin = document.getElementById('sermonBulletin');
        const sermonSpotify = document.getElementById('sermonSpotify');
        const sermonApplePodcasts = document.getElementById('sermonApplePodcasts');

        sermonTitle.textContent = activeSermon.title;
        sermonScripture.textContent = activeSermon.scripture;
        sermonDate.textContent = `Date: ${activeSermon.date}`;
        pastorName.textContent = activeSermon.author;
        
        if (activeSermon.youtube_url) {
          sermonYoutube.href = activeSermon.youtube_url;
          sermonYoutube.style.display = 'block';
        } else {
          sermonYoutube.style.display = 'none';
        }
        
        if (activeSermon.bulletin_url) {
          sermonBulletin.href = activeSermon.bulletin_url;
          sermonBulletin.style.display = 'block';
        } else {
          sermonBulletin.style.display = 'none';
        }
        
        if (activeSermon.spotify_url) {
          sermonSpotify.href = activeSermon.spotify_url;
          sermonSpotify.style.display = 'block';
        } else {
          sermonSpotify.style.display = 'none';
        }
        
        if (activeSermon.apple_podcasts_url) {
          sermonApplePodcasts.href = activeSermon.apple_podcasts_url;
          sermonApplePodcasts.style.display = 'block';
        } else {
          sermonApplePodcasts.style.display = 'none';
        }
      } else {
        console.error('No active sermon found.');
      }
    })
    .catch(error => console.error('Error loading the sermon data:', error));
});