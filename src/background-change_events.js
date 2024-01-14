function changeBackgroundImageEvents() {
    var min = 2;
    var max = 4;
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    var imageUrl = '/assets/websiteBG-events/' + randomNum + '.png';    var eventsElement = document.getElementById('events');
    eventsElement.style.opacity = 0;
    eventsElement.style.backgroundImage = 'url(' + imageUrl + ')';
    setTimeout(function() {
      eventsElement.style.opacity = 1;
    }, 100);
}

changeBackgroundImageEvents();

setInterval(changeBackgroundImageEvents, 7500);