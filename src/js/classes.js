// Alpine.js functions for Classes page
window.classesData = function() {
    return {
        classes: [],
        filteredClasses: [],
        searchQuery: '',
        loadingComplete: false,
        
        init() {
            this.loadClasses();
        },
        
        loadClasses() {
            this.classes = [];
            this.filteredClasses = [];
            
            // Load all class data
            const classFiles = [
                { name: 'Biblical Interpretation', file: 'biblical-interpretation.json' },
                { name: 'Confessional Theology', file: 'confessional-theology.json' },
                { name: 'Membership Seminar', file: 'membership-seminar.json' }
            ];
            
            const loadPromises = classFiles.map(classInfo => 
                fetch(`data/podcasts/${classInfo.file}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => ({
                        ...data,
                        className: classInfo.name,
                        episodeCount: data.episodes ? data.episodes.length : 0
                    }))
                    .catch(error => {
                        console.error(`Error loading ${classInfo.name}:`, error);
                        return null;
                    })
            );
            
            Promise.all(loadPromises)
                .then(results => {
                    this.classes = results.filter(result => result !== null);
                    this.filteredClasses = [...this.classes];
                    this.loadingComplete = true;
                    console.log('Classes loaded:', this.classes.length);
                })
                .catch(error => {
                    console.error('Error loading classes:', error);
                    this.loadingComplete = true;
                });
        },

        filterClasses() {
            if (!this.searchQuery.trim()) {
                this.filteredClasses = [...this.classes];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.filteredClasses = this.classes.filter(classData => 
                    classData.title?.toLowerCase().includes(query) ||
                    classData.className?.toLowerCase().includes(query) ||
                    classData.episodes?.some(episode => 
                        episode.title?.toLowerCase().includes(query)
                    )
                );
            }
        },

        getEpisodesForClass(className) {
            const classData = this.classes.find(c => c.className === className);
            return classData ? classData.episodes : [];
        }
    };
}; 