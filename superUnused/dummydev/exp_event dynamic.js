    <div class="weekly-section" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="font-family: 'Barlow', sans-serif; color: white; font-size: 10vw; text-align: center; margin: 0; display:flex; ">CPC Weekly</h1>


        <table id="eventsTable" style="width:80%; margin: 0 auto; color: white;">
            <tr style="align-items: left; text-align: left;"">
                <th style="font-family: 'Barlow', sans-serif; font-size: 2em;">Event Name</th>
                <th style="font-family: 'Barlow', sans-serif; font-size: 2em;">Date</th> 
                <th style="font-family: 'Barlow', sans-serif; font-size: 2em;">Thumbnail</th>
                <th style="font-family: 'Barlow', sans-serif; font-size: 2em;">Action</th>
            </tr>
        </table>
        <script>
            var eventsTable = document.getElementById('eventsTable');
            var events = JSON.parse(localStorage.getItem('september2023Events'));
            events.forEach(function(event) {
                var row = eventsTable.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.textContent = event.name;
                cell2.textContent = event.date;
                cell3.innerHTML = '<img src="' + event.thumbnail + '" alt="Event Thumbnail" style="width:50px;height:50px;">';
                cell4.innerHTML = '<button onclick="window.location.href=\'event.html?name=' + event.name + '\'">Go to Event</button>';
            });
        </script>



        <button id="moreEvents" style="padding: 10px 20px;">More Events</button>
    </div>
    <style>

    </style>
    <script>
        document.getElementById('moreEvents').addEventListener('click', function() {
            var eventsList = document.querySelector('.events-list');
            var events = JSON.parse(localStorage.getItem('september2023Events'));
            events.forEach(function(event) {
                var listItem = document.createElement('li');
                listItem.textContent = event.name;
                listItem.style.backgroundImage = 'url(' + event.thumbnail + ')'; // Add thumbnail image from JSON data
                eventsList.appendChild(listItem);
            });
        });
    </script>

    <script>
        var events = [
            {
                "name": "Fellowship Lunch",
                "date": "2023-09-01",
                "thumbnail": "path/to/thumbnail1.jpg"
            },
            {
                "name": "Prayer in the Parlor",
                "date": "2023-09-05",
                "thumbnail": "path/to/thumbnail2.jpg"
            },
            {
                "name": "Event 3",
                "date": "2023-09-10",
                "thumbnail": "path/to/thumbnail3.jpg"
            },
            {
                "name": "Event 4",
                "date": "2023-09-15",
                "thumbnail": "path/to/thumbnail4.jpg"
            },
            {
                "name": "Event 5",
                "date": "2023-09-20",
                "thumbnail": "path/to/thumbnail5.jpg"
            },
            {
                "name": "Event 6",
                "date": "2023-09-25",
                "thumbnail": "path/to/thumbnail6.jpg"
            },
            {
                "name": "Event 7",
                "date": "2023-09-30",
                "thumbnail": "path/to/thumbnail7.jpg"
            },
            {
                "name": "Event 4",
                "date": "2023-09-15",
                "thumbnail": "path/to/thumbnail4.jpg"
            },
            {
                "name": "Event 5",
                "date": "2023-09-20",
                "thumbnail": "path/to/thumbnail5.jpg"
            },
            {
                "name": "Event 6",
                "date": "2023-09-25",
                "thumbnail": "path/to/thumbnail6.jpg"
            },
        ];
        
        // Save events to localStorage
        localStorage.setItem('september2023Events', JSON.stringify(events));
    </script>