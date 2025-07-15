// Alpine.js functions for Sunday Sermons page
console.log('Sunday Sermons JS loaded');

window.sermonData = function() {
    return {
        sortKey: 'date',
        sortAsc: false,
        searchQuery: '',
        sermons: [],
        filteredSermons: [],
        loadingComplete: false,
        
        init() {
            this.loadSermons();
        },
        
        loadSermons() {
            console.log('loadSermons called');
            console.log('Fetching from: data/sunday-sermons.json');
            fetch('data/sunday-sermons.json')
                .then(response => {
                    console.log('Response received:', response);
                    console.log('Response status:', response.status);
                    console.log('Response ok:', response.ok);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data loaded:', data);
                    console.log('Episodes count:', data.episodes ? data.episodes.length : 'no episodes');
                    // Format dates for display
                    this.sermons = (data.episodes || []).map(sermon => ({
                        ...sermon,
                        displayDate: sermon.date ? new Date(sermon.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : sermon.date
                    }));
                    this.filteredSermons = [...this.sermons];
                    this.sortSermons();
                    this.loadingComplete = true;
                    console.log('Sermons loaded:', this.sermons.length);
                    console.log('Filtered sermons:', this.filteredSermons.length);
                })
                .catch(error => {
                    console.error('Error loading sermons:', error);
                    console.error('Error details:', error.message);
                    this.sermons = [];
                    this.filteredSermons = [];
                    this.loadingComplete = true;
                });
        },

        filterSermons() {
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
        },

        sortSermons() {
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
        }
    };
}; 