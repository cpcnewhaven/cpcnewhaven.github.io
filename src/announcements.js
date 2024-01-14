// Function to create announcement HTML
function createAnnouncementHtml(announcement) {
    var title = announcement.title || 'No Title';
    var date = announcement.date || '';
    var time = announcement.time || '';
    var description = announcement.description || '';
    var schedule = announcement.schedule || '';

    return `
        <div class="announcement">
       
            <h2>${title}</h2>
            ${date ? `<p><strong>Date:</strong> ${date}</p>` : ''}
            ${time ? `<p><strong>Time:</strong> ${time}</p>` : ''}
            ${schedule ? `<p><strong>Schedule:</strong> ${schedule}</p>` : ''}
            <p>${description}</p>
        </div>
    `;
}

// Function to render announcements
function renderAnnouncements(announcements) {
    var announcementsContainer = document.getElementById('announcements');
    var htmlContent = announcements.map(createAnnouncementHtml).join('');
    announcementsContainer.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/announcements/2023/announcements_week51-23.json')
        .then(response => response.json())
        .then(data => {
            renderAnnouncements(data.announcements);
        })
        .catch(error => console.error('Error fetching data:', error));
});
