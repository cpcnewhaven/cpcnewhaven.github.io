// Alpine.js functions for Classes page
window.loadClasses = function() {
    const classTypes = [
        { key: 'biblical', file: 'biblical-interpretation.json' },
        { key: 'membership', file: 'membership-seminar.json' },
        { key: 'compline', file: 'compline-homilies.json' },
        { key: 'confessional', file: 'confessional-theology.json' }
    ];

    const loadPromises = classTypes.map(classType => 
        fetch(`./data/podcasts/${classType.file}`)
            .then(response => response.json())
            .then(data => {
                // Add class type to each episode
                const episodes = data.episodes || [];
                episodes.forEach(episode => {
                    episode.classType = this.getClassName(classType.key);
                    episode.id = `${classType.key}-${episode.number}`;
                });
                this.classes[classType.key] = episodes;
            })
            .catch(error => {
                console.warn(`Could not load ${classType.file}:`, error);
                this.classes[classType.key] = [];
            })
    );

    Promise.all(loadPromises).then(() => {
        this.filterEpisodes();
    });
};

window.getClassName = function(key) {
    const classNames = {
        'biblical': 'Biblical Interpretation',
        'membership': 'Membership Seminar',
        'compline': 'Compline Homilies',
        'confessional': 'Confessional Theology'
    };
    return classNames[key] || key;
};

window.filterEpisodes = function() {
    let allEpisodes = [];
    
    // Combine all episodes from selected class(es)
    if (this.selectedClass === 'all') {
        Object.values(this.classes).forEach(classEpisodes => {
            allEpisodes = allEpisodes.concat(classEpisodes);
        });
    } else {
        allEpisodes = this.classes[this.selectedClass] || [];
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        this.filteredEpisodes = allEpisodes.filter(episode => 
            episode.title?.toLowerCase().includes(query) ||
            episode.classType?.toLowerCase().includes(query)
        );
    } else {
        this.filteredEpisodes = allEpisodes;
    }

    // Sort by episode number
    this.filteredEpisodes.sort((a, b) => {
        const aNum = parseInt(a.number) || 0;
        const bNum = parseInt(b.number) || 0;
        return aNum - bNum;
    });
}; 