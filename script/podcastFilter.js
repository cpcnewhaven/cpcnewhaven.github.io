// JavaScript code to fetch and display podcast episodes and implement filtering.
const episodeList = document.getElementById("episodeList");
const podcastFilter = document.getElementById("podcastFilter");
const showFilter = document.getElementById("showFilter");
const hostFilter = document.getElementById("hostFilter");
const topicFilter = document.getElementById("topicFilter");
const dateFilter = document.getElementById("dateFilter");

// Function to fetch podcast episodes from JSON data or backend
function fetchPodcastEpisodes(jsonData) {
	// Fetches episodes from the JSON data and populates episodeList with the retrieved data.

	fetch(jsonData)
		.then(response => response.json())
		.then(data => {
			data.forEach(
				episode => {
					const episodeElement = document.createElement("div");
					episodeElement.classList.add("episode");
					episodeElement.setAttribute("data-podcast", episode.Podcast);
					episodeElement.setAttribute("data-show", episode.Show)
					episodeElement.setAttribute("data-series", episode.Series);
					episodeElement.setAttribute("data-episode", episode.Episode);
					episodeElement.setAttribute("data-name", episode.Title);
					episodeElement.setAttribute("data-speaker", episode.Speaker);
					episodeElement.setAttribute("data-scripture", episode.Scripture);
					episodeElement.setAttribute("data-description", episode.Description);
					episodeElement.setAttribute("data-youtube", episode.YouTube);
					episodeElement.setAttribute("data-audiofile", episode.AudioFile);
					episodeElement.setAttribute("data-spotify", episode.Spotify);
					episodeElement.setAttribute("data-bulletin", episode.Bulletin);
					episodeElement.setAttribute("data-artwork", episode.Artwork);

					if (!episode.Episode) {
						EP = ""}
					else {
						EP = "Episode " + episode.Episode + ":";
					}
					if (!episode.YouTube) {
						YT = ""} 
					else {
						YT = '<img class="imgYT" src="https://i3.ytimg.com/vi/' + episode.YouTube.replace('https://youtu.be/','') + '/maxresdefault.jpg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
					}

					if (!episode.Spotify){
						SP = ""}
					else {
						SP = "<a href=" + episode.Spotify + ">[Spotify]</a>";
					}

					if (!episode.AudioFile){
						AF = ""}
					else {
						AF = "<a href=" + episode.AudioFile + ">[MP3]</a>";

					}

					if (!episode.Bulletin){
						BU = ""}
					else {
						BU = "<a href=" + episode.Bulletin + ">[Bulletin]</a>";
					}
					

					episodeElement.innerHTML = `
						<tr class="episodeTR">
							<td><img class="podcastArtwork" src="${episode.Artwork}">${episode.Podcast}</td>
							<td><p class="textShow">${episode.Show}: ${episode.Series}</p></td>
							<td><p class="textEpName">${EP} ${episode.Title}</p></td>
							<td>${episode.Description}<br>${episode.Scripture}</td>
							<td>${YT} ${SP} ${AF} ${BU}</td>
						</tr>
					`;

					episodeList.appendChild(episodeElement);
				}
			);                    
		})
		.catch(error => console.error("Error fetching data:", error));
}


// Function to apply filters to the episodes
function applyFilters() {
	const episodes = document.querySelectorAll(".episode");
	const podcastValue = podcastFilter.value.toLowerCase();
	const hostValue = hostFilter.value.toLowerCase();
	const showValue = showFilter.value.toLowerCase();


	episodes.forEach(function(episode) {
		const podcast = episode.getAttribute("data-podcast").toLowerCase();
		const host = episode.getAttribute("data-speaker").toLowerCase();
		const show = episode.getAttribute("data-show").toLowerCase();
		
		
		if (
			podcast.includes(podcastValue) && 
			host.includes(hostValue) &&
			show.includes(showValue)
		) 
		{
			episode.style.display = "block"; // Show episode
		} else {
			episode.style.display = "none"; // Hide episode
		}
	});
};
