document.addEventListener('DOMContentLoaded', function() {
    fetch('data/podcast-index.json')
        .then(response => response.json())
        .then(data => {
            const sundaySermons = data.sundaySermons.episodes;
            const beyondSermons = data.beyond.episodes;
            const sundayTableBody = document.querySelector('#sunday-sermon-table tbody');
            const beyondTableBody = document.querySelector('#beyond-sermon-table tbody');
            const sundayTable = document.querySelector('#sunday-sermon-table');
            const beyondTable = document.querySelector('#beyond-sermon-table');

            // Apply the new class to the tables
            sundayTable.classList.add('podcast-table');
            beyondTable.classList.add('podcast-table');

            // Sort the sermons by date in descending order (latest first)
            sundaySermons.sort((a, b) => new Date(b.date) - new Date(a.date));
            beyondSermons.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

            // Render the table rows
            function renderTable(sermons, tableBody, isBeyond = false, isWWB = false) {
                tableBody.innerHTML = '';
                sermons.forEach(sermon => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${isWWB ? sermon.number : formatDate(isBeyond ? sermon.date_added : sermon.date)}</td>
                        <td>${sermon.title}</td>
                        ${isBeyond ? `<td>${sermon.guest}</td>` : isWWB ? '' : `<td>${sermon.author}</td>`}
                        ${isBeyond || isWWB ? '' : `<td>${sermon.scripture}</td>`}
                        <td><a href="${sermon.audio_url || sermon.link || sermon.spotify_url}" target="_blank">Listen</a></td>  
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Initial render
            renderTable(sundaySermons, sundayTableBody);
            renderTable(beyondSermons, beyondTableBody, true);

            // Search and filter functionality
            document.getElementById('searchInput').addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const filteredSermons = sundaySermons.filter(sermon => sermon.title.toLowerCase().includes(query));
                renderTable(filteredSermons, sundayTableBody);
            });

            document.getElementById('filterDate').addEventListener('change', function() {
                const selectedDate = this.value;
                const filteredSermons = sundaySermons.filter(sermon => sermon.date === selectedDate);
                renderTable(filteredSermons, sundayTableBody);
            });

            document.getElementById('filterSpeaker').addEventListener('change', function() {
                const selectedSpeaker = this.value.toLowerCase();
                const filteredSermons = sundaySermons.filter(sermon => sermon.author.toLowerCase().includes(selectedSpeaker));
                renderTable(filteredSermons, sundayTableBody);
            });

            document.getElementById('filterGuest').addEventListener('change', function() {
                const selectedGuest = this.value.toLowerCase();
                const filteredSermons = beyondSermons.filter(sermon => sermon.guest.toLowerCase().includes(selectedGuest));
                renderTable(filteredSermons, beyondTableBody, true);
            });
        })
        .catch(error => console.error('Error fetching podcast data:', error));

    fetch('./data/podcasts/biblical-interpretation.json')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('biblical-interpretation-table');
            if (!table) return;
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            data.episodes.forEach(episode => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${episode.number}</td>
                    <td>${episode.title}</td>
                    <td><a href="${episode.link}" target="_blank">Listen</a></td>
                `;
                tbody.appendChild(tr);
            });
        });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    // Adjust for timezone offset
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}