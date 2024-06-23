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

        sermonTitle.textContent = activeSermon.title;
        sermonScripture.textContent = activeSermon.scripture;
        sermonDate.textContent = `Date: ${activeSermon.date}`;
        pastorName.textContent = activeSermon.author;
      } else {
        console.error('No active sermon found.');
      }
    })
    .catch(error => console.error('Error loading the sermon data:', error));
});