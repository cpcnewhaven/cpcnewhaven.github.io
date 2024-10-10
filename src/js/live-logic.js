document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/upcomingSermon.json')
        .then(response => response.json())
        .then(data => {
            const activeSermon = data.find(sermon => sermon.active && sermon.status === 'present');
            if (activeSermon) {
                document.getElementById('sermon-title').textContent = activeSermon.title;
                document.getElementById('sermon-scripture').textContent = activeSermon.scripture;
                document.getElementById('sermon-date').textContent = new Date(activeSermon.date).toLocaleDateString();
                document.getElementById('sermon-author').textContent = activeSermon.author;
                document.getElementById('sermon-video').src = activeSermon.youtube_url || 'https://youtube.com/c/CPCNewHaven/live';
                document.getElementById('bulletin-link').href = activeSermon.bulletin_url || '#';
                document.getElementById('thumbnail-link').href = activeSermon.youtube_url || 'https://youtube.com/c/CPCNewHaven/live';
            } else {
                // Default to a graphic if no active sermon is present
                document.getElementById('sermon-video').src = 'https://youtube.com/c/CPCNewHaven/live';
                document.getElementById('thumbnail-link').href = 'https://youtube.com/c/CPCNewHaven/live';
            }
        })
        .catch(error => console.error('Error fetching sermon data:', error));
});