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
            
                    const homeImageUrl = `./assets/websiteBG/${randomIndices[0]}.png`;
                    const midImageUrl = `./assets/websiteBG/${randomIndices[1]}.png`;
            
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