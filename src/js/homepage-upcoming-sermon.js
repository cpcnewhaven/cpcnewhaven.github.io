document.addEventListener('DOMContentLoaded', function() {
    var widget = document.getElementById('upcoming-sermon-widget');
    if (!widget) return;

    fetch('./data/homepage-upcoming-sermon.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to fetch upcoming sermon');
            }
            return response.json();
        })
        .then(function(data) {
            var sermon = Array.isArray(data) ? data.find(function(item) {
                return item && item.active;
            }) : data;

            if (!sermon) {
                widget.innerHTML = '<p class="upcoming-sermon-empty">No upcoming sermon is available right now.</p>';
                return;
            }

            var dateParts = sermon.date.split('-').map(Number);
            var sermonDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var formattedDate = sermonDate.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            var previewLink = sermon.youtube_url || '#';
            var bulletinLink = sermon.bulletin_url || '#';

            widget.innerHTML = `
                <article class="upcoming-sermon-card">
                    <div class="upcoming-sermon-pill">Upcoming Sermon</div>
                    <h3 class="upcoming-sermon-title">${sermon.title}</h3>
                    <p class="upcoming-sermon-scripture">${sermon.scripture}</p>
                    <p class="upcoming-sermon-author">${sermon.author}</p>
                    <p class="upcoming-sermon-date">${formattedDate}</p>
                    <div class="upcoming-sermon-actions">
                        <a class="upcoming-sermon-link preview" href="${previewLink}" target="_blank" rel="noopener noreferrer">Preview</a>
                        <a class="upcoming-sermon-link bulletin" href="${bulletinLink}" target="_blank" rel="noopener noreferrer">Bulletin</a>
                        <a class="upcoming-sermon-link sermons" href="sunday-sermons.html">All Sermons</a>
                    </div>
                </article>
            `;
        })
        .catch(function(error) {
            console.error('Error loading upcoming sermon:', error);
            widget.innerHTML = '<p class="upcoming-sermon-empty">Unable to load the upcoming sermon right now.</p>';
        });
});
