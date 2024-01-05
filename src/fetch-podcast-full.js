document.addEventListener('DOMContentLoaded', function() {
    fetch('podcasts/podcastDB.json')
        .then(response => response.json())
        .then(data => {
            const table = document.querySelector('#podcast-table table');
            data.forEach(podcast => {
                const row = document.createElement('tr');
                
                const titleCell = document.createElement('td');
                titleCell.textContent = podcast.title;
                row.appendChild(titleCell);
                
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(podcast.date).toLocaleDateString();
                row.appendChild(dateCell);
                
                const spotifyLinkCell = document.createElement('td');
                const spotifyLink = document.createElement('a');
                spotifyLink.href = podcast.spotifyLink;
                spotifyLink.textContent = 'Listen on Spotify';
                spotifyLinkCell.appendChild(spotifyLink);
                row.appendChild(spotifyLinkCell);
                
                const preacherCell = document.createElement('td');
                preacherCell.textContent = podcast.preacher;
                row.appendChild(preacherCell);
                
                const bibleVerseCell = document.createElement('td');
                bibleVerseCell.textContent = podcast.bibleVerse;
                row.appendChild(bibleVerseCell);
                
                table.appendChild(row);
            });
        });
});