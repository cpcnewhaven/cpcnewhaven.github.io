// Alpine.js functions for Beyond Podcast page
console.log('Beyond Podcast JS loaded');

window.loadEpisodes = function() {
    console.log('loadEpisodes called');
    fetch('./data/beyond-podcast.json')
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            this.episodes = data.episodes || [];
            this.filteredEpisodes = [...this.episodes];
            this.sortEpisodes();
            console.log('Episodes loaded:', this.episodes.length);
        })
        .catch(error => {
            console.error('Error loading episodes:', error);
            this.episodes = [];
            this.filteredEpisodes = [];
        });
};

window.filterEpisodes = function() {
    console.log('filterEpisodes called');
    if (!this.searchQuery.trim()) {
        this.filteredEpisodes = [...this.episodes];
    } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredEpisodes = this.episodes.filter(episode => 
            episode.title?.toLowerCase().includes(query) ||
            episode.guest?.toLowerCase().includes(query) ||
            episode.date_added?.toLowerCase().includes(query)
        );
    }
    this.sortEpisodes();
};

window.sortEpisodes = function() {
    console.log('sortEpisodes called');
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