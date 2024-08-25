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