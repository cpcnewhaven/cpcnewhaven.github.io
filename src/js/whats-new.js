/**
 * What's New Manager
 * Dynamically aggregates latest podcast episodes and sermons
 */

class WhatsNewManager {
    constructor() {
        this.rssUrl = 'https://anchor.fm/s/4c59256c/podcast/rss';
        this.sermonsUrl = './data/sunday-sermons.json';
        this.container = document.getElementById('whats-new-container');
        this.limit = 3; // Total items to show
        this.init();
    }

    async init() {
        if (!this.container) return;

        this.displayLoading();

        try {
            const [podcastItems, sermonItems] = await Promise.all([
                this.fetchPodcasts(),
                this.fetchSermons()
            ]);

            const allItems = [...podcastItems, ...sermonItems];
            
            // Sort by date (newest first)
            allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Take top N items
            const latestItems = allItems.slice(0, this.limit);

            this.renderItems(latestItems);
        } catch (error) {
            console.error('Error loading What\'s New:', error);
            this.displayError();
        }
    }

    async fetchPodcasts() {
        try {
            // Using rss2json to avoid CORS issues and get easy-to-parse JSON
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.rssUrl)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch RSS');
            
            const data = await response.json();
            if (data.status !== 'ok') throw new Error('RSS conversion failed');

            return data.items.map(item => ({
                type: 'podcast',
                tag: 'Podcast',
                title: item.title,
                description: this.stripHtml(item.description).substring(0, 150) + '...',
                date: item.pubDate,
                link: item.link,
                image: item.thumbnail
            }));
        } catch (error) {
            console.warn('Podcast fetch failed:', error);
            return [];
        }
    }

    async fetchSermons() {
        try {
            const response = await fetch(this.sermonsUrl);
            if (!response.ok) throw new Error('Failed to fetch sermons');
            
            const data = await response.json();
            const episodes = data.episodes || [];

            // Return first 5 episodes to be safe for sorting
            return episodes.slice(0, 5).map(s => ({
                type: 'sermon',
                tag: 'Sermon',
                title: s.title,
                description: `${s.scripture} | ${s.author}`,
                date: s.date,
                link: s.link || s.spotify_url || 'sunday-sermons.html',
                image: s['podcast-thumbnail_url'] || 'assets/web-assets/cpcLOGO.png'
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
        return new Date(dateString).toLocaleDateString(undefined, options);
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
            card.className = `whats-new-card tag-${item.type}`;
            if (item.type === 'podcast' || item.link.includes('spotify.com') || item.link.includes('youtube.com')) {
                card.target = '_blank';
            }

            card.innerHTML = `
                <div class="card-tag">${item.tag}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-footer">
                    <span class="card-date"><i class="far fa-calendar-alt"></i> ${this.formatDate(item.date)}</span>
                    <span class="card-link">${item.type === 'podcast' || item.type === 'sermon' ? 'Listen Now' : 'Learn More'} <i class="fas fa-arrow-right"></i></span>
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
