// Alpine.js functions for Beyond Podcast page
window.loadEpisodes = function() {
    fetch('./data/podcast-index.json')
        .then(response => response.json())
        .then(data => {
            this.episodes = data.beyond || [];
            this.filteredEpisodes = [...this.episodes];
            this.sortEpisodes();
        })
        .catch(error => {
            console.error('Error loading episodes:', error);
            this.episodes = [];
            this.filteredEpisodes = [];
        });
};

window.filterEpisodes = function() {
    if (!this.searchQuery.trim()) {
        this.filteredEpisodes = [...this.episodes];
    } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredEpisodes = this.episodes.filter(episode => 
            episode.title?.toLowerCase().includes(query) ||
            episode.guest?.toLowerCase().includes(query) ||
            episode.date?.toLowerCase().includes(query)
        );
    }
    this.sortEpisodes();
};

window.sortEpisodes = function() {
    this.filteredEpisodes.sort((a, b) => {
        let aValue = a[this.sortKey] || '';
        let bValue = b[this.sortKey] || '';
        
        // Handle date sorting
        if (this.sortKey === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            // String sorting
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
        }
        
        if (aValue < bValue) {
            return this.sortAsc ? -1 : 1;
        }
        if (aValue > bValue) {
            return this.sortAsc ? 1 : -1;
        }
        return 0;
    });
}; 