// JavaScript code to randomly change background images every 5 seconds

function changeBackgroundImage() {
    var min = 2;
    var max = 4;
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    var imageUrl = '/assets/websiteBG-events/' + randomNum + '.png';
    var worshipElement = document.getElementById('events');
    worshipElement.style.opacity = 0; // Start with the image invisible
    worshipElement.style.backgroundImage = 'url(' + imageUrl + ')';
    setTimeout(function() {
      worshipElement.style.opacity = 1; // Fade in the new image
    }, 100); // Adjust the duration as needed
  }

// Change background image on page load
changeBackgroundImage();

// Change background image every 5 seconds
setInterval(changeBackgroundImage, 7500);