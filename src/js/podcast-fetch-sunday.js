       document.addEventListener('DOMContentLoaded', function() {
                    fetch('data/podcast-index.json')
                        .then(response => response.json())
                        .then(data => {
                            const sundaySermons = data.sundaySermons.episodes;
                            const tableBody = document.querySelector('#sunday-sermon-table tbody');

                            // Sort the sermons by date in descending order (latest first)
                            sundaySermons.sort((a, b) => new Date(b.date) - new Date(a.date));

                            sundaySermons.forEach(sermon => {
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
                        })
                        .catch(error => console.error('Error fetching podcast data:', error));
                });

                function formatDate(dateString) {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return new Date(dateString).toLocaleDateString('en-US', options);
                }