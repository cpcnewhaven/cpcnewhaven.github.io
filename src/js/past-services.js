// Alpine.js functions for Past Services page
console.log('Past Services JS loaded');

window.serviceData = function() {
    return {
        sortKey: 'date',
        sortAsc: false,
        searchQuery: '',
        viewMode: 'card', // Default to card view
        services: [],
        filteredServices: [],
        loadingComplete: false,
        
        init() {
            this.loadServices();
        },
        
        loadServices() {
            console.log('loadServices called');
            console.log('Fetching from: data/past-services.json');
            fetch('data/past-services.json')
                .then(response => {
                    console.log('Response received:', response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data loaded:', data);
                    // Format dates for display
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
                    this.filteredServices = [...this.services];
                    this.sortServices();
                    this.loadingComplete = true;
                    console.log('Services loaded:', this.services.length);
                })
                .catch(error => {
                    console.error('Error loading services:', error);
                    this.services = [];
                    this.filteredServices = [];
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
            // Most are Sundays, but just format the date nicely
            return date.toLocaleDateString('en-US', options);
        },

        filterServices() {
            if (!this.searchQuery.trim()) {
                this.filteredServices = [...this.services];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.filteredServices = this.services.filter(service => 
                    service.title?.toLowerCase().includes(query) ||
                    service.date?.toLowerCase().includes(query)
                );
            }
            this.sortServices();
        },

        sortServices() {
            this.filteredServices.sort((a, b) => {
                let aValue = a[this.sortKey] || '';
                let bValue = b[this.sortKey] || '';
                
                // Handle date sorting
                if (this.sortKey === 'date') {
                    // Treat "Unknown Date" as very old
                    const defaultDate = new Date("2000-01-01").getTime();
                    aValue = new Date(aValue).getTime() || defaultDate;
                    bValue = new Date(bValue).getTime() || defaultDate;
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
