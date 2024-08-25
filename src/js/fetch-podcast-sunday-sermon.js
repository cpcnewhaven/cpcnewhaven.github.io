document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('podcastSearchInput');
    const searchResults = document.getElementById('searchResults');
    const sundaySermonList = document.getElementById('sunday-sermon-list');
    let allPodcasts = [];

    // Fetch all podcast data
    fetch('data/podcast-index.json')
        .then(response => response.json())
        .then(data => {
            const sundaySermonData = data.sundaySermons;
            allPodcasts = sundaySermonData.episodes;

            // Display Sunday Sermon episodes
            displaySundaySermonEpisodes(sundaySermonData.episodes);

            // Set up search functionality
            searchInput.addEventListener('input', performSearch);
        })
        .catch(error => console.error('Error loading podcast data:', error));

    function performSearch() {
        const query = searchInput.value.toLowerCase();
        const results = allPodcasts.filter(podcast => 
            podcast.title.toLowerCase().includes(query) ||
            podcast.scripture.toLowerCase().includes(query)
        );

        displayResults(results);
    }

    function displayResults(results) {
        searchResults.innerHTML = '';
        results.slice(0, 5).forEach(podcast => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('search-result');
            resultElement.innerHTML = `
                <strong>${podcast.title}</strong><br>
                ${podcast.date} - ${podcast.scripture}
            `;
            resultElement.addEventListener('click', () => {
                window.open(podcast.spotify_url || podcast.youtube_url || podcast.apple_podcasts_url, '_blank');
            });
            searchResults.appendChild(resultElement);
        });
    }

    function displaySundaySermonEpisodes(episodes) {
        episodes.forEach(episode => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            const listNumber = document.createElement('span');

            listNumber.textContent = episode.id + '.';
            listNumber.classList.add('wwbclass-list-number');
            
            link.href = episode.spotify_url || episode.youtube_url || episode.apple_podcasts_url;
            link.target = '_blank';
            link.textContent = episode.title;

            listItem.appendChild(listNumber);
            listItem.appendChild(link);
            sundaySermonList.appendChild(listItem);
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const splashImageSection = document.getElementById('home-image');
    const midImageSection = document.getElementById('mid-image');
    const totalImages = 14; // Total number of images in the folder
    
    // Generate two unique random indices
    let randomIndices = [];
    while (randomIndices.length < 2) {
        let randomIndex = Math.floor(Math.random() * totalImages) + 1;
        if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
        }
    }

    const homeImageUrl = `./assets/websiteBG-podcasts/${randomIndices[0]}.png`;
    const midImageUrl = `./assets/websiteBG-podcasts/${randomIndices[1]}.png`;

    // Fetch and set the background image for home-image
    fetch(homeImageUrl)
        .then(response => {
            if (response.ok) {
                splashImageSection.style.backgroundImage = `url(${homeImageUrl})`;
            } else {
                console.error('Image not found:', homeImageUrl);
            }
        })
        .catch(error => {
            console.error('Error fetching the image:', error);
        });

    // Fetch and set the background image for mid-image
    fetch(midImageUrl)
        .then(response => {
            if (response.ok) {
                midImageSection.style.backgroundImage = `url(${midImageUrl})`;
            } else {
                console.error('Image not found:', midImageUrl);
            }
        })
        .catch(error => {
            console.error('Error fetching the image:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('data/podcast-index.json')
        .then(response => response.json())
        .then(data => {
            const titleElement = document.getElementById('wwbclass-title');
            const episodeListElement = document.getElementById('wwbclass-episode-list');
            const podcastSeries = data.podcastSeries;

            // Set the title
            titleElement.textContent = podcastSeries.title;

            // Create episode list
            podcastSeries.episodes.forEach(episode => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                const listNumber = document.createElement('span');
                const playButton = document.createElement('button');

                listNumber.textContent = episode.number + '.';
                listNumber.classList.add('wwbclass-list-number');
                
                link.href = episode.link;
                link.target = '_blank';
                link.textContent = episode.title;

                playButton.textContent = 'Play';
                playButton.classList.add('wwbclass-play-button');
                playButton.onclick = function() {
                    window.open(episode.link, '_blank');
                };

                listItem.appendChild(listNumber);
                listItem.appendChild(link);
                listItem.appendChild(playButton);
                episodeListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('podcastSearchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const podcastSections = document.querySelectorAll('.inner-page-section');
        let results = [];

        podcastSections.forEach(section => {
            const sectionTitle = section.querySelector('h2').textContent.toLowerCase();
            const episodes = section.querySelectorAll('iframe');

            episodes.forEach(episode => {
                const episodeTitle = episode.getAttribute('src').split('/').pop().split('?')[0];
                if (episodeTitle.includes(searchTerm)) {
                    results.push({ title: episodeTitle, link: episode.getAttribute('src') });
                }
            });
        });

        displaySearchResults(results);
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        if (results.length > 0) {
            searchResults.style.display = 'block';
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.innerHTML = `<a href="${result.link}" target="_blank">${result.title}</a>`;
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.style.display = 'none';
        }
    }
});