document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/announcements/upcomingEvents.json') // Updated fetch URL
        .then(response => response.json())
        .then(data => {
            const eventsTable = document.getElementById('upcomingEventsTable');
            const tbody = eventsTable.getElementsByTagName('tbody')[0];
            data.upcomingEvents.forEach(event => {
                const row = tbody.insertRow();
                const titleCell = row.insertCell(0);
                const dateCell = row.insertCell(1);

                titleCell.textContent = event.title;
                dateCell.textContent = event.date; // Display the date
            });
        })
        .catch(error => console.error('Error loading the upcoming events:', error));
});