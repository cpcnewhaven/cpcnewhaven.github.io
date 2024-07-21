document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/upcomingSermon.json')
        .then(response => response.json())
        .then(data => {
            const activeSermon = data.find(sermon => sermon.active);
            if (activeSermon) {
                document.getElementById('sermon-title').textContent = activeSermon.title;
                document.getElementById('sermon-scripture').textContent = activeSermon.scripture;
                document.getElementById('sermon-date').textContent = new Date(activeSermon.date).toLocaleDateString();
                document.getElementById('sermon-author').textContent = activeSermon.author;
                document.getElementById('sermon-video').src = activeSermon.youtube_url || 'https://youtube.com/c/CPCNewHaven/live';
                document.getElementById('bulletin-link').href = activeSermon.bulletin_url || '#'; // Update with actual link if available
            }
        })
        .catch(error => console.error('Error fetching sermon data:', error));
});