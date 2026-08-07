/**
 * What's New Manager
 * Dynamically displays the latest sermons from CPC
 */

class WhatsNewManager {
    constructor() {
        this.sermonsUrl = './data/sunday-sermons.json';
        this.container = document.getElementById('whats-new-container');
        this.limit = 3; // Total items to show
        this.init();
    }

    async init() {
        if (!this.container) return;

        this.displayLoading();

        try {
            const sermonItems = await this.fetchSermons();

            // Sort by date (newest first)
            sermonItems.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Deduplicate by normalized title just in case the source file includes repeats
            const seen = new Set();
            const deduped = sermonItems.filter(item => {
                const key = item.title.toLowerCase().replace(/\s+/g, ' ').trim();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            // Take top N items
            const latestItems = deduped.slice(0, this.limit);

            this.renderItems(latestItems);
        } catch (error) {
            console.error('Error loading What\'s New:', error);
            this.displayError();
        }
    }

    async fetchSermons() {
        try {
            const response = await fetch(this.sermonsUrl);
            if (!response.ok) throw new Error('Failed to fetch sermons');

            const data = await response.json();
            const episodes = data.episodes || [];

            return episodes.map(s => ({
                type: 'sermon',
                tag: 'Sermon',
                title: s.title,
                description: `${s.scripture} | ${s.author}`,
                date: s.date,
                link: s.link || s.spotify_url || 'sunday-sermons.html'
            }));
        } catch (error) {
            console.warn('Sermons fetch failed:', error);
            return [];
        }
    }

    stripHtml(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
    }

    renderItems(items) {
        if (items.length === 0) {
            this.container.innerHTML = '<p class="whats-new-empty">No recent updates found.</p>';
            return;
        }

        this.container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'whats-new-grid';

        items.forEach(item => {
            const card = document.createElement('a');
            card.href = item.link;
            card.className = 'whats-new-card tag-sermon';
            if (item.link.includes('spotify.com') || item.link.includes('youtube.com')) {
                card.target = '_blank';
            }

            card.innerHTML = `
                <div class="card-tag">${item.tag}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-footer">
                    <span class="card-date"><i class="far fa-calendar-alt"></i> ${this.formatDate(item.date)}</span>
                    <span class="card-link">Listen Now <i class="fas fa-arrow-right"></i></span>
                </div>
            `;
            grid.appendChild(card);
        });

        this.container.appendChild(grid);
    }

    displayLoading() {
        this.container.innerHTML = `
            <div class="whats-new-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading latest updates...</p>
            </div>
        `;
    }

    displayError() {
        this.container.innerHTML = `
            <div class="whats-new-error">
                <p>Unable to load the latest updates. Please check back later.</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WhatsNewManager();
});
