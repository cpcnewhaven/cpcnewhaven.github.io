// Alpine.js functions for Sunday Sermons page
window.loadSermons = function() {
    fetch('./data/podcast-index.json')
        .then(response => response.json())
        .then(data => {
            this.sermons = data.sundaySermons || [];
            this.filteredSermons = [...this.sermons];
            this.sortSermons();
        })
        .catch(error => {
            console.error('Error loading sermons:', error);
            this.sermons = [];
            this.filteredSermons = [];
        });
};

window.filterSermons = function() {
    if (!this.searchQuery.trim()) {
        this.filteredSermons = [...this.sermons];
    } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredSermons = this.sermons.filter(sermon => 
            sermon.title?.toLowerCase().includes(query) ||
            sermon.speaker?.toLowerCase().includes(query) ||
            sermon.scripture?.toLowerCase().includes(query) ||
            sermon.date?.toLowerCase().includes(query)
        );
    }
    this.sortSermons();
};

window.sortSermons = function() {
    this.filteredSermons.sort((a, b) => {
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