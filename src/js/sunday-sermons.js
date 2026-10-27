// Alpine.js functions for Sunday Sermons page
console.log('Sunday Sermons JS loaded');

window.sermonData = function() {
    return {
        sortKey: 'date',
        sortAsc: false,
        searchQuery: '',
        selectedPreacher: 'all',
        selectedBook: 'all',
        selectedYear: 'all',
        availablePreachers: [],
        availableBooks: [],
        availableYears: [],
        viewMode: 'card', // Default to card view
        sermons: [],
        filteredSermons: [],
        loadingComplete: false,
        
        init() {
            this.loadSermons();
        },
        
        loadSermons() {
            fetch('data/sunday-sermons.json', { cache: 'no-cache' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const episodes = data.episodes || [];
                    this.sermons = episodes.map(sermon => ({
                        ...sermon,
                        displayDate: sermon.date ? this.formatSundayDate(sermon.date) : sermon.date
                    }));

                    // Extract available filter values
                    this.extractFilterOptions();

                    this.filteredSermons = [...this.sermons];
                    this.sortSermons();
                    this.loadingComplete = true;
                })
                .catch(error => {
                    console.error('Error loading sermons:', error);
                    this.sermons = [];
                    this.filteredSermons = [];
                    this.loadingComplete = true;
                });
        },

        extractFilterOptions() {
            const preacherCounts = {};
            const bookCounts = {};
            const years = new Set();

            this.sermons.forEach(s => {
                // Preacher
                const p = (s.author || '').trim();
                if (p) {
                    preacherCounts[p] = (preacherCounts[p] || 0) + 1;
                }

                // Scripture Book
                const sc = (s.scripture || '').trim();
                if (sc) {
                    // Extract book name (e.g. "Acts 3:1-26" -> "Acts", "1 Corinthians" -> "1 Corinthians")
                    const match = sc.match(/^((?:[1-3]\s+)?[A-Za-z]+)/);
                    if (match) {
                        let book = match[1].trim();
                        // Normalize typo in legacy data (e.g. "Pslam" -> "Psalm")
                        if (book.toLowerCase() === 'pslam') book = 'Psalm';
                        bookCounts[book] = (bookCounts[book] || 0) + 1;
                    }
                }

                // Year
                if (s.date && s.date.length >= 4) {
                    years.add(s.date.substring(0, 4));
                }
            });

            // Sort preachers by frequency
            this.availablePreachers = Object.keys(preacherCounts).sort((a, b) => preacherCounts[b] - preacherCounts[a]);
            // Sort books alphabetically
            this.availableBooks = Object.keys(bookCounts).sort();
            // Sort years newest first
            this.availableYears = Array.from(years).sort().reverse();
        },

        formatSundayDate(dateString) {
            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
            const date = new Date(year, month - 1, day);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return `Sunday, ${date.toLocaleDateString('en-US', options)}`;
        },

        filterSermons() {
            let result = [...this.sermons];

            // Text search
            if (this.searchQuery && this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                result = result.filter(sermon => 
                    sermon.title?.toLowerCase().includes(query) ||
                    sermon.author?.toLowerCase().includes(query) ||
                    sermon.scripture?.toLowerCase().includes(query) ||
                    sermon.date?.toLowerCase().includes(query)
                );
            }

            // Preacher filter
            if (this.selectedPreacher !== 'all') {
                result = result.filter(sermon => (sermon.author || '').trim() === this.selectedPreacher);
            }

            // Book filter
            if (this.selectedBook !== 'all') {
                const bookQuery = this.selectedBook.toLowerCase();
                result = result.filter(sermon => {
                    const sc = (sermon.scripture || '').toLowerCase();
                    return sc.includes(bookQuery) || (bookQuery === 'psalm' && sc.includes('pslam'));
                });
            }

            // Year filter
            if (this.selectedYear !== 'all') {
                result = result.filter(sermon => sermon.date && sermon.date.startsWith(this.selectedYear));
            }

            this.filteredSermons = result;
            this.sortSermons();
        },

        resetFilters() {
            this.searchQuery = '';
            this.selectedPreacher = 'all';
            this.selectedBook = 'all';
            this.selectedYear = 'all';
            this.filterSermons();
        },

        hasActiveFilters() {
            return (this.searchQuery && this.searchQuery.trim() !== '') ||
                   this.selectedPreacher !== 'all' ||
                   this.selectedBook !== 'all' ||
                   this.selectedYear !== 'all';
        },

        sortSermons() {
            this.filteredSermons.sort((a, b) => {
                let aValue = a[this.sortKey] || '';
                let bValue = b[this.sortKey] || '';
                
                if (this.sortKey === 'date') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                } else {
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
