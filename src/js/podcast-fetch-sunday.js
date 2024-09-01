       document.addEventListener('DOMContentLoaded', function() {
                    fetch('data/podcast-index.json')
                        .then(response => response.json())
                        .then(data => {
                            const sundaySermons = data.sundaySermons.episodes;
                            const tableBody = document.querySelector('#sunday-sermon-table tbody');
                            const table = document.querySelector('#sunday-sermon-table');

                            // Apply the new class to the table
                            table.classList.add('podcast-table');

                            // Sort the sermons by date in descending order (latest first)
                            sundaySermons.sort((a, b) => new Date(b.date) - new Date(a.date));

                            // Render the table rows
                            function renderTable(sermons) {
                                tableBody.innerHTML = '';
                                sermons.forEach(sermon => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${formatDate(sermon.date)}</td>
                                        <td>${sermon.title}</td>
                                        <td>${sermon.author}</td>
                                        <td>${sermon.scripture}</td>
                                        <td><a href="${sermon.spotify_url}" target="_blank">Listen on Spotify</a></td>
                                    `;
                                    tableBody.appendChild(row);
                                });
                            }

                            // Initial render
                            renderTable(sundaySermons);

                            // Filter functionality
                            document.querySelector('#filter-title').addEventListener('input', function() {
                                const filterValue = this.value.toLowerCase();
                                const filteredSermons = sundaySermons.filter(sermon => sermon.title.toLowerCase().includes(filterValue));
                                renderTable(filteredSermons);
                            });

                            document.querySelector('#filter-author').addEventListener('input', function() {
                                const filterValue = this.value.toLowerCase();
                                const filteredSermons = sundaySermons.filter(sermon => sermon.author.toLowerCase().includes(filterValue));
                                renderTable(filteredSermons);
                            });

                            document.querySelector('#filter-scripture').addEventListener('input', function() {
                                const filterValue = this.value.toLowerCase();
                                const filteredSermons = sundaySermons.filter(sermon => sermon.scripture.toLowerCase().includes(filterValue));
                                renderTable(filteredSermons);
                            });
                        })
                        .catch(error => console.error('Error fetching podcast data:', error));
                });

                function formatDate(dateString) {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return new Date(dateString).toLocaleDateString('en-US', options);
                }