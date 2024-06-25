document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/community-events.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('communityEventsTableContainer');
            let table = '<table id="communityEventsTable" class="community-events-table">';
            table += '<tr><th>Day</th><th>Date</th><th>Time</th><th>Title</th><th>Details</th></tr>';
            data.events.forEach(event => {
                table += `<tr>
                            <td>${event.day}</td>
                            <td>${event.date}</td>
                            <td>${event.time}</td>
                            <td>${event.title}</td>
                            <td><a href="${event.detailsLink}" target="_blank">More Info</a></td>
                          </tr>`;
            });
            table += '</table>';
            container.innerHTML = table;
        })
        .catch(error => console.error('Error loading community events:', error));
});