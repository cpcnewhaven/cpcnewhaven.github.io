document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/announcements/ongoingEvents.json')
        .then(response => response.json())
        .then(data => {
            const eventsTable = document.getElementById('ongoingEventsTable');
            const tbody = eventsTable.getElementsByTagName('tbody')[0];

            // Sort events by date (assuming event.date is in a valid date format)
            data.ongoingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

            data.ongoingEvents.forEach(event => {
                const row = tbody.insertRow();
                const titleCell = row.insertCell(0);
                const descriptionCell = row.insertCell(1);
                // Removed dateCell and its usage

                titleCell.textContent = event.title;
                descriptionCell.innerHTML = event.description; // Use innerHTML to render HTML content
                // Removed dateCell.textContent assignment
            });
        })
        .catch(error => console.error('Error loading the events:', error));
});