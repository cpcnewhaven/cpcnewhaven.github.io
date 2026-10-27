// Alpine.js functions for Past Services page
console.log('Past Services JS loaded');

window.serviceData = function() {
    return {
        sortKey: 'date',
        sortAsc: false,
        searchQuery: '',
        selectedYear: 'all',
        availableYears: [],
        displayLimit: 24,
        viewMode: 'card', // Default to card view
        services: [],
        filteredServices: [],
        loadingComplete: false,
        
        init() {
            this.loadServices();
        },
        
        loadServices() {
            fetch('data/past-services.json', { cache: 'no-cache' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.services = (data.services || []).map(service => {
                        let displayD = service.date;
                        if (displayD && displayD !== "Unknown Date") {
                            displayD = this.formatSundayDate(displayD);
                        }
                        return {
                            ...service,
                            displayDate: displayD
                        };
                    });

                    // Extract available years
                    const years = new Set();
                    this.services.forEach(s => {
                        if (s.date && s.date !== "Unknown Date" && s.date.length >= 4) {
                            years.add(s.date.substring(0, 4));
                        }
                    });
                    this.availableYears = Array.from(years).sort().reverse();

                    this.filteredServices = [...this.services];
                    this.sortServices();
                    this.loadingComplete = true;
                })
                .catch(error => {
                    console.error('Error loading services:', error);
                    this.services = [];
                    this.filteredServices = [];
                    this.loadingComplete = true;
                });
        },

        formatSundayDate(dateString) {
            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
            const date = new Date(year, month - 1, day);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        },

        filterServices() {
            let result = [...this.services];

            if (this.searchQuery && this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                result = result.filter(service => 
                    service.title?.toLowerCase().includes(query) ||
                    service.date?.toLowerCase().includes(query)
                );
            }

            if (this.selectedYear !== 'all') {
                result = result.filter(service => 
                    service.date && service.date.startsWith(this.selectedYear)
                );
            }

            this.filteredServices = result;
            this.displayLimit = 24; // reset pagination on filter change
            this.sortServices();
        },

        resetFilters() {
            this.searchQuery = '';
            this.selectedYear = 'all';
            this.filterServices();
        },

        hasActiveFilters() {
            return (this.searchQuery && this.searchQuery.trim() !== '') || this.selectedYear !== 'all';
        },

        loadMore() {
            this.displayLimit += 24;
        },

        sortServices() {
            this.filteredServices.sort((a, b) => {
                let aValue = a[this.sortKey] || '';
                let bValue = b[this.sortKey] || '';
                
                if (this.sortKey === 'date') {
                    const defaultDate = new Date("2000-01-01").getTime();
                    aValue = new Date(aValue).getTime() || defaultDate;
                    bValue = new Date(bValue).getTime() || defaultDate;
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
