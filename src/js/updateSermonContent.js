document.addEventListener('DOMContentLoaded', function() {
  fetch('./data/upcomingSermon.json')
    .then(response => response.json())
    .then(data => {
      const sermonTitle = document.getElementById('sermonTitle');
      const sermonScripture = document.getElementById('sermonScripture');
      const sermonDate = document.getElementById('sermonDate');
      const pastorName = document.getElementById('pastorName');

      sermonTitle.textContent = data.title;
      sermonScripture.textContent = data.scripture;
      sermonDate.textContent = `Date: ${data.date}`;
      pastorName.textContent = data.author;
    })
    .catch(error => console.error('Error loading the sermon data:', error));
});