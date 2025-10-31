let jsonData = [];

// Fetching JSON data from the "names.json" file located inside the "script" directory
fetch('./script/names.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        jsonData = data;
        displayPhotos();
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

function displayPhotos(data = jsonData) {
    let yearbookDiv = document.getElementById('yearbook');
    data.forEach(person => {
        let photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        
        let img = document.createElement('img');
        img.src = person.imageURL;
        
        let nameP = document.createElement('p');
        nameP.textContent = person.name;

        let yearP = document.createElement('p');
        yearP.textContent = "Joined CPC in " + person.year;
        yearP.className = "year-text";
        
        photoCard.appendChild(img);
        photoCard.appendChild(nameP);
        photoCard.appendChild(yearP);
        
        yearbookDiv.appendChild(photoCard);
    });
}

function sortByName() {
    jsonData.sort((a, b) => a.name.localeCompare(b.name));
    clearPhotos();
    displayPhotos();
}

function sortByYear() {
    jsonData.sort((a, b) => a.year.localeCompare(b.year));
    clearPhotos();
    displayPhotos();
}

function sortByRecentMember() {
    jsonData.sort((a, b) => b.year.localeCompare(a.year));
    clearPhotos();
    displayPhotos();
}

function filterPhotos() {
    clearPhotos();
    let searchTerm = document.getElementById('searchBar').value.toLowerCase();
    let filteredData = jsonData.filter(person => 
        person.name.toLowerCase().includes(searchTerm) ||
        person.year.includes(searchTerm)
    );
    displayPhotos(filteredData);
}

function clearPhotos() {
    let yearbookDiv = document.getElementById('yearbook');
    while (yearbookDiv.firstChild) {
        yearbookDiv.removeChild(yearbookDiv.firstChild);
    }
}
