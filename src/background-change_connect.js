// JavaScript code to randomly change background images every 5 seconds

function changeBackgroundImage() {
    var min = 1;
    var max = 3;
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    var imageUrl = '/assets/websiteBG_connect/' + randomNum + '.png';
    var worshipElement = document.getElementById('connect');
    var opacity = 0; // Start with the image invisible
    var intervalId = setInterval(function() {
         if (opacity < 1) {
            opacity += 0.1; // Increase opacity gradually
            worshipElement.style.opacity = opacity; 
            if (opacity = 0) {
                worshipElement.style.backgroundImage = 'url(' + imageUrl + ')';
            }
        } else { 
            clearInterval(intervalId); // Stop the interval
            var fadeInInterval = setInterval(function() {
                if (opacity > 1) {
                    opacity -= 0.1; // Decrease opacity gradually
                    worshipElement.style.opacity = opacity 
                   
                } else {
                    clearInterval(fadeInInterval); // Stop the interval
                }
            }, 100); // Adjust the duration as needed
        }
    }, 100); // Adjust the duration as needed
}s
// Change background image on page load
changeBackgroundImage();

// Change background image every 5 seconds

setTimeout(changeBackgroundImage, 5000);
