// Alpine.js functions for Sunday Sermons page
console.log('Sunday Sermons JS loaded');

window.sermonData = function() {
    return {
        sortKey: 'date',
        sortAsc: false,
        searchQuery: '',
        viewMode: 'card', // Default to card view
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
                    // Format dates for display - always show as Sunday sermons
                    this.sermons = (data.episodes || []).map(sermon => ({
                        ...sermon,
                        displayDate: sermon.date ? this.formatSundayDate(sermon.date) : sermon.date
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

        formatSundayDate(dateString) {
            // Parse the date string and ensure it's treated as local time, not UTC
            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
            const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
            
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return `Sunday, ${date.toLocaleDateString('en-US', options)}`;
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