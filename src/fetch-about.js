document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/about.json') // Assuming the JSON file is located in the data folder
        .then(response => response.json())
        .then(data => {
            renderAbout(data.about);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function renderAbout(aboutData) {
    var aboutContainer = document.getElementById('about');
    var htmlContent = aboutData.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
    aboutContainer.innerHTML = htmlContent;
}