document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/announcements/ongoingEvents.json')
        .then(response => response.json())
        .then(data => {
            const eventsTable = document.getElementById('ongoingEventsTable');
            const tbody = eventsTable.getElementsByTagName('tbody')[0];

            // Filter out inactive events
            const activeEvents = data.ongoingEvents.filter(event => event.active === "true");

            // Sort events by date
            activeEvents.sort((a, b) => new Date(a.dateEntered) - new Date(b.dateEntered));

            activeEvents.forEach(event => {
                const row = tbody.insertRow();
                const titleCell = row.insertCell(0);
                const descriptionCell = row.insertCell(1);

                titleCell.textContent = event.title;
                descriptionCell.innerHTML = event.description; // Use innerHTML to render HTML content
            });
        })
        .catch(error => console.error('Error loading the events:', error));
});