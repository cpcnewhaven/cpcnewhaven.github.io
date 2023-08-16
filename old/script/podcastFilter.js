// JavaScript code to fetch and display podcast episodes and implement filtering.
const episodeList = document.getElementById("episodeList");
const podcastFilter = document.getElementById("podcastFilter");
const showFilter = document.getElementById("showFilter");
const hostFilter = document.getElementById("hostFilter");
const topicFilter = document.getElementById("topicFilter");
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");

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
					episodeElement.setAttribute("data-date", episode.Date);
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
						EP = "Episode " + episode.Episode + ": ";
					}
					
					if (!episode.Date) {
						DT = ""}
					else {
						DT = " | " + episode.Date;
					}

					if (!episode.YouTube) {
						YT = ""} 
					else {
						YT = '<a href="' + episode.YouTube +'"><img class="imgYT" src="https://i3.ytimg.com/vi/' + episode.YouTube.replace('https://youtu.be/','').replace('(?:\?t=.*$)','') + '/maxresdefault.jpg" </a>';
					}

					if (!episode.Spotify){
						SP = ""}
					else {
						//SP = '<iframe class="iframeSP" style="border-radius:12px" src="' + episode.Spotify + '"?utm_source=generator" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
						SP = '<a href="' + episode.Spotify + '"><img class="imgSP"></a>';
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
						<div class="episode">
							<img class="episodeArtwork" src="${episode.Artwork}">
							<span class="podcastName"${episode.Podcast}</span>
							<span class="showName">${episode.Show}</span>: 
							<span class="seriesName">${episode.Series}</span>
							<span class="episodeNumber">${EP}</span>
							<span class="episodeTitle">${episode.Title}</span>
							<span class="episodeDate">${DT}</span>
							<br>
							<span class="episodeDescription">${episode.Description}</span>
							<span class="episodeScripture">${episode.Scripture}</span>
							<br>
							<span class="episodeYouTube>${YT} </span>
							<span class="episodeSpodity">${SP} </span>
							<span class="episodeAudioFile">${AF} </span>
							<span class="episodeBulletin">${BU}</span>
						</div>
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
	const yearValue = yearFilter.value.toLowerCase();
	const monthValue = monthFilter.value.toLowerCase();


	episodes.forEach(function(episode) {
		const podcast = episode.getAttribute("data-podcast").toLowerCase();
		const host = episode.getAttribute("data-speaker").toLowerCase();
		const show = episode.getAttribute("data-show").toLowerCase();
		const date = new Date(episode.getAttribute("data-date"))
		const year = date.getFullYear();
		const month = date.getMonth();
		
		if (
			podcast.includes(podcastValue) && 
			host.includes(hostValue) &&
			show.includes(showValue) &&
			(yearValue == "" || year == yearValue) &&
			(monthValue == "" || month == monthValue)
		) 
		{
			episode.style.display = "block"; // Show episode
		} else {
			episode.style.display = "none"; // Hide episode
		}
	});
};
