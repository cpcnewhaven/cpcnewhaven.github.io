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
            function renderTable(sermons, tableBody, isBeyond = false, isWWB = false, page = 1, rowsPerPage = 10) {
                tableBody.innerHTML = '';
                const start = (page - 1) * rowsPerPage;
                const end = start + rowsPerPage;
                const paginatedSermons = sermons.slice(start, end);

                paginatedSermons.forEach(sermon => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${isWWB ? sermon.number : formatDate(isBeyond ? sermon.date_added : sermon.date)}</td>
                        <td>${sermon.title}</td>
                        ${isBeyond ? `<td>${sermon.guest}</td>` : isWWB ? '' : `<td>${sermon.author}</td>`}
                        ${isBeyond || isWWB ? '' : `<td>${sermon.scripture}</td>`}
                        <td><a href="${sermon.link}" target="_blank">Listen</a></td>  
                    `;
                    tableBody.appendChild(row);
                });

                // Removed pagination controls
            }

            // Initial render
            renderTable(sundaySermons, sundayTableBody);
            renderTable(beyondSermons, beyondTableBody, true);

            // Filter functionality for Sunday Sermons
            document.querySelector('#filter-title').addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const filteredSermons = sundaySermons.filter(sermon => sermon.title.toLowerCase().includes(filterValue));
                renderTable(filteredSermons, sundayTableBody);
            });

            document.querySelector('#filter-author').addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const filteredSermons = sundaySermons.filter(sermon => sermon.author.toLowerCase().includes(filterValue));
                renderTable(filteredSermons, sundayTableBody);
            });

            document.querySelector('#filter-scripture').addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const filteredSermons = sundaySermons.filter(sermon => sermon.scripture.toLowerCase().includes(filterValue));
                renderTable(filteredSermons, sundayTableBody);
            });

            // Filter functionality for Beyond Sermons
            document.querySelector('#filter-beyond-title').addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const filteredSermons = beyondSermons.filter(sermon => sermon.title.toLowerCase().includes(filterValue));
                renderTable(filteredSermons, beyondTableBody, true);
            });

            document.querySelector('#filter-beyond-guest').addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const filteredSermons = beyondSermons.filter(sermon => sermon.guest.toLowerCase().includes(filterValue));
                renderTable(filteredSermons, beyondTableBody, true);
            });
        })
        .catch(error => console.error('Error fetching podcast data:', error));
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}