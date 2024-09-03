

  
  let tableBody = document.querySelector('#eventTable tbody');
  
  events.forEach(event => {
    let row = document.createElement('tr');
  
    let dateCell = document.createElement('td');
    dateCell.textContent = event.date;
    row.appendChild(dateCell);
  
    let eventCell = document.createElement('td');
    eventCell.textContent = event.event;
    row.appendChild(eventCell);
  
    let timeCell = document.createElement('td');
    timeCell.textContent = event.time;
    row.appendChild(timeCell);
  
    let locationCell = document.createElement('td');
    locationCell.textContent = event.location;
    row.appendChild(locationCell);
  
    tableBody.appendChild(row);
  });

// Fetch ongoing events from JSON and populate the table
fetch('./data/announcements/ongoingEvents.json')
    .then(response => response.json())
    .then(data => {
        let ongoingEventsTable = document.querySelector('#ongoingEventsTable tbody');
        
        data.ongoingEvents.forEach(event => {
            let row = document.createElement('tr');
            
            let titleCell = document.createElement('td');
            titleCell.textContent = event.title;
            row.appendChild(titleCell);
            
            let descCell = document.createElement('td');
            descCell.innerHTML = event.description; // Use innerHTML to render HTML content
            row.appendChild(descCell);
            
            let dateCell = document.createElement('td');
            dateCell.textContent = event.dateEntered;
            row.appendChild(dateCell);
            
            ongoingEventsTable.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading ongoing events:', error));