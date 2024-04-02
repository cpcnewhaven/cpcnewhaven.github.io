// Function to fetch CSV data
async function fetchCSVData(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

// Function to parse CSV data and generate HTML
function parseCSVAndGenerateHTML(csvData) {
    // Assuming PapaParse is included in your HTML for CSV parsing
    Papa.parse(csvData, {
        header: true,
        complete: function(results) {
            const episodes = results.data;
            const container = document.getElementById('old-podcast-container');
            episodes.forEach(episode => {
                const episodeDiv = document.createElement('div');
                episodeDiv.className = 'episode';

                const episodeName = document.createElement('h3');
                episodeName.textContent = episode['Name'];

                const episodeLink = document.createElement('a');
                episodeLink.setAttribute('href', episode['Episode Link']);
                episodeLink.textContent = 'Listen';
                episodeLink.className = 'episode-link';

                episodeDiv.appendChild(episodeName);
                episodeDiv.appendChild(episodeLink);

                container.appendChild(episodeDiv);
            });
        }
    });
}

// Fetch the CSV data and generate HTML
fetchCSVData('@CPC New Haven Podcasts - Episodes_2021s.csv')
    .then(csvData => parseCSVAndGenerateHTML(csvData))
    .catch(error => console.error('Error fetching or parsing CSV data:', error));