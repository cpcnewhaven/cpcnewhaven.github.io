// Alpine.js functions for Classes page
window.classesData = function() {
    return {
        classes: [],
        filteredClasses: [],
        searchQuery: '',
        viewMode: 'card', // Default to card view
        loadingComplete: false,
        
        init() {
            this.loadClasses();
        },
        
        loadClasses() {
            this.classes = [];
            this.filteredClasses = [];
            
            // Load all class data
            const classFiles = [
                { tag: 'biblical-interpretation', name: 'Biblical Interpretation', file: 'biblical-interpretation.json' },
                { tag: 'confessional-theology', name: 'Confessional Theology', file: 'confessional-theology.json' },
                { tag: 'membership-seminar', name: 'Membership Seminar', file: 'membership-seminar.json' }
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
                        classTag: classInfo.tag,
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

                    // Handle URL hash after classes have been loaded
                    if (window.location.hash) {
                        this.$nextTick(() => {
                            const target = document.getElementById(window.location.hash.substring(1));
                            if (target) {
                                target.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        });
                    }
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