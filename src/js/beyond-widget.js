/**
 * Beyond the Sunday Sermon Homepage Widget
 * Fetches and displays the latest 3 episodes from data/beyond-podcast.json
 */
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('beyond-widget-grid');
    if (!container) return;

    fetch('./data/beyond-podcast.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const episodes = data.episodes || [];
            if (episodes.length === 0) return;

            // Sort episodes descending by number (or date_added)
            episodes.sort((a, b) => {
                const numA = Number(a.number) || 0;
                const numB = Number(b.number) || 0;
                if (numB !== numA) return numB - numA;
                return new Date(b.date_added || 0) - new Date(a.date_added || 0);
            });

            // Take the latest 3
            const latestThree = episodes.slice(0, 3);

            // Re-render cards dynamically
            container.innerHTML = latestThree.map(ep => {
                const durationText = ep.duration ? ` · ${escapeHtml(ep.duration)}` : '';
                const dateText = ep.date_added ? escapeHtml(ep.date_added) : '';
                const titleText = ep.title ? escapeHtml(ep.title) : 'Episode';
                const guestText = ep.guest ? escapeHtml(ep.guest) : '';
                const linkUrl = ep.link || 'beyond-podcast.html';

                return `
                    <div class="beyond-card">
                        <div class="beyond-card-header">
                            <div class="beyond-episode-number">Episode ${escapeHtml(String(ep.number))}</div>
                            <div class="beyond-episode-date">${dateText}${durationText}</div>
                        </div>
                        <h3 class="beyond-episode-title">${titleText}</h3>
                        ${guestText ? `<div class="beyond-episode-guest">${guestText}</div>` : ''}
                        <div class="beyond-card-footer">
                            <a href="${escapeHtml(linkUrl)}" class="beyond-listen-btn" target="_blank" rel="noopener">
                                <i class="fas fa-play"></i> Listen
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.warn('Could not refresh Beyond Podcast widget from JSON:', err);
            // Pre-rendered HTML in index.html remains intact
        });

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
