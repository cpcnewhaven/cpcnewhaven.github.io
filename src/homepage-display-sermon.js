document.addEventListener('DOMContentLoaded', function() {
  fetch('data/upcomingSermon.json')
    .then(response => response.json())
    .then(data => {
      const activeSermon = data.find(sermon => sermon.active && sermon.status === 'present');
      if (activeSermon) {
        document.getElementById('sermonTitle').textContent = activeSermon.title || 'Sermon Title';
        document.getElementById('sermonScripture').textContent = activeSermon.scripture || 'Scripture';
        document.querySelector('.ag-worship-image').src = activeSermon['podcast-thumbnail_url'] || 'default-image.jpg';
        document.querySelector('.ag-worship-image').alt = activeSermon.title || 'Sermon Image';
      }
    })
    .catch(error => console.error('Error fetching sermon data:', error));
});
