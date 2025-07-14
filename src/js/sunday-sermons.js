// Alpine.js functions for Sunday Sermons page
console.log('Sunday Sermons JS loaded');

window.loadSermons = function() {
    console.log('loadSermons called');
    fetch('./data/sunday-sermons.json')
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            this.sermons = data.episodes || [];
            this.filteredSermons = [...this.sermons];
            this.sortSermons();
            console.log('Sermons loaded:', this.sermons.length);
        })
        .catch(error => {
            console.error('Error loading sermons:', error);
            this.sermons = [];
            this.filteredSermons = [];
        });
};

window.filterSermons = function() {
    console.log('filterSermons called');
    if (!this.searchQuery.trim()) {
        this.filteredSermons = [...this.sermons];
    } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredSermons = this.sermons.filter(sermon => 
            sermon.title?.toLowerCase().includes(query) ||
            sermon.author?.toLowerCase().includes(query) ||
            sermon.scripture?.toLowerCase().includes(query) ||
            sermon.date?.toLowerCase().includes(query)
        );
    }
    this.sortSermons();
};

window.sortSermons = function() {
    console.log('sortSermons called');
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