document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            // Assuming each event has a 'date' property in 'YYYY-MM-DD' format
            const sortedEvents = data.events.sort((a, b) => new Date(b.date) - new Date(a.date));
            const recentEvents = sortedEvents.slice(0, 10);
            renderEventsPreview(recentEvents);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function renderEventsPreview(eventsData) {
    var eventsContainer = document.getElementById('events-preview'); // Ensure you have this ID in your HTML
    var htmlContent = '<h2>Upcoming Events</h2><div class="calendar-preview"><ul>';
    eventsData.forEach((event, index) => {
        // Added unique ID for each event title based on its index
        const eventId = `event-title-${index}`;
        htmlContent += `<li><span id="${eventId}" class="event-date">${event.date}</span> - <span class="event-description">${event.description}</span></li>`;
    });
    htmlContent += '</ul></div>';
    htmlContent += '<a href="events.html" class="view-all-events-btn">View All Events</a>'; // Button to link to the full events page
    eventsContainer.innerHTML = htmlContent;
}