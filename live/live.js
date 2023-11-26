var playlistId = "PL7xij5KggExvD0S8Aq3oTT0XhMqFCyZ2l"; // Replace with your Playlist ID
var apiKey = "AIzaSyCKLBaWBkgv5mLF52ZVEWqB7mazxAB35-s"; // Replace with your API Key
var maxResults = 1;

var url = 'https://www.googleapis.com/youtube/v3/playlistItems?key=' + apiKey + '&playlistId=' + playlistId + '&part=snippet,id&order=date&maxResults=' + maxResults;

fetch(url)
    .then(response => response.json())
    .then(data => {
        var videoId = data.items[0].snippet.resourceId.videoId;
        document.getElementById('youtube_video').innerHTML = '<iframe width="100%" height="90vh" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
    })
    .catch(err => console.log(err));