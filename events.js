// events.js
let events = [
    {
        date: "10 September",
        event: "Sunday Funday",
        time: "After Worship",
        location: "CPC Lawn",
        desc: "Come to the Sunday Worship!"
    },
    {
        date: "17 September",
        event: "Ministry Year Kick-Off!",
        time: "",
        location: "",
        desc: "Come to the Sunday Worship!"
    },
    {
        date: "23 September",
        event: "Men & Kids Can Cook Tailgate (Cornell @ Yale Football)",
        time: "10am",
        location: "Cornell @ Yale Football",
        desc: "Come to the Sunday Worship!"
    },
    {
        date: "01 October",
        event: "Installation Service of Senior Pastor",
        time: "4:30pm",
        location: "",
        desc: "Come to the worship service for the installation of the senior pastor "
    },
    {
        date: "17 September",
        event: "Ministry Year Kick-Off!",
        time: "",
        location: "",
        desc: ""
    },

    // ... add more events here
];


  
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