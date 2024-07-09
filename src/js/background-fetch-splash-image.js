document.addEventListener("DOMContentLoaded", function() {
    const splashImageSection = document.getElementById('home-image');
    const midImageSection = document.getElementById('mid-image');
    const totalImages = 50; // Total number of images in the folder

    function getRandomImageUrl() {
        const randomIndex = Math.floor(Math.random() * totalImages) + 1;
        return `./assets/websiteBG/${randomIndex}.jpg`; // Changed to .jpg
    }

    function updateImages() {
        const homeImageUrl = getRandomImageUrl();
        const midImageUrl = getRandomImageUrl();

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
    }

    // Initial image update
    updateImages();
});
