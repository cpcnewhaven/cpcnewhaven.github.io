// Load the Google Drive API
gapi.load('client', init);

// Initialize the Google Drive API client
function init() {
  gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scope: 'https://www.googleapis.com/auth/drive.readonly'
  }).then(function() {
    // Authenticate the user
    return gapi.auth2.getAuthInstance().signIn();
  }).then(function() {
    // Fetch the images from Google Drive
    return gapi.client.drive.files.list({
      q: "mimeType='image/jpeg'", // Filter for JPEG images
      pageSize: 10, // Maximum number of images to fetch
      fields: 'files(webContentLink)' // Retrieve only the webContentLink field
    });
  }).then(function(response) {
    var images = response.result.files;
    // Create the mosaic gallery
    var gallery = document.getElementById('gallery');
    images.forEach(function(image) {
      var img = document.createElement('img');
      img.src = image.webContentLink;
      gallery.appendChild(img);
    });
  }).catch(function(error) {
    console.log('Error: ' + error.message);
  });
}