document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            renderEventsByMonth(data.events);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function renderEventsByMonth(eventsData) {
    const eventsContainer = document.getElementById('events');
    let htmlContent = '<h1>Events</h1>';

    // Group events by month
    const months = ["Mar", "Apr", "May", "Jun"]; // Specify the months you want to include
    const eventsByMonth = {};
    eventsData.forEach(event => {
        const month = event.date.split(' ')[1]; // Assuming date format is "DD MMM"
        if (months.includes(month)) {
            if (!eventsByMonth[month]) {
                eventsByMonth[month] = [];
            }
            eventsByMonth[month].push(event);
        }
    });

    // Generate HTML content for each month
    Object.keys(eventsByMonth).forEach(month => {
        htmlContent += `<div class="calendar" id="24Events-calendar-${month}"><h2>${month} 2024</h2><ul>`;
        eventsByMonth[month].forEach((event, index) => {
            htmlContent += `<li id="24Events-${month}-${index}"><strong>${event.date}</strong> - ${event.description}</li>`;
        });
        htmlContent += '</ul></div>';
    });

    eventsContainer.innerHTML = htmlContent;
}