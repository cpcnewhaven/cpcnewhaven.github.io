document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('./data/events.json').then(response => response.json()),
        fetch('./data/announcements/ongoingEvents.json').then(response => response.json())
    ])
    .then(([eventsData, ongoingEventsData]) => {
        const combinedEvents = eventsData.events.concat(ongoingEventsData.ongoingEvents);
        renderEventsByMonth(combinedEvents);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function renderEventsByMonth(eventsData) {
    const eventsContainer = document.getElementById('events');
    let htmlContent = '<div class="events-grid">'; // Start grid container

    // Dynamically determine months from events data
    const eventsByMonth = {};
    eventsData.forEach(event => {
        const month = event.date.split(' ')[1]; // Assuming date format is "DD MMM"
        if (!eventsByMonth[month]) {
            eventsByMonth[month] = [];
        }
        eventsByMonth[month].push(event);
    });

    // Sort months with August first, then the rest in descending order
    const monthOrder = ["Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan", "Sep", "Oct", "Nov", "Dec"];
    const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });

    // Generate HTML content for each month in sorted order
    sortedMonths.forEach(month => {
        htmlContent += `<div class="calendar" id="24Events-calendar-${month}"><h2>${month} 2024</h2><ul>`;
        eventsByMonth[month].forEach((event, index) => {
            htmlContent += `<li class="grid-item" id="24Events-${month}-${index}"><strong>${event.date}</strong> - ${event.description}</li>`; // Apply grid-item class
        });
        htmlContent += '</ul></div>';
    });

    htmlContent += '</div>'; // Close grid container
    eventsContainer.innerHTML = htmlContent;
}