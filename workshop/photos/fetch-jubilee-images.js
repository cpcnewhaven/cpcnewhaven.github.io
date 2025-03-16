async function loadGallery(elementId, jsonFile) {
    const response = await fetch(jsonFile);
    const images = await response.json();

    const gallery = document.getElementById(elementId);
    gallery.innerHTML = '';

    // Shuffle images array
    images.sort(() => Math.random() - 0.5);

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = image.name;
        gallery.appendChild(imgElement);
    });
}

// Load the Jubilee gallery
loadGallery('jubilee', 'jubilee_images.json');