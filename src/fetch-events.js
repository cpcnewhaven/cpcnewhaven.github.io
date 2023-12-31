document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            renderEvents(data.events);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function renderEvents(eventsData) {
    var eventsContainer = document.getElementById('events');
    var htmlContent = '<h1>Events</h1><div class="calendar"><h2>December 2023</h2><ul>';
    eventsData.forEach(event => {
        htmlContent += `<li><strong>${event.date}</strong> - ${event.description}</li>`;
    });
    htmlContent += '</ul></div>';
    eventsContainer.innerHTML = htmlContent;
}