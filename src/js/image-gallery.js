document.addEventListener("DOMContentLoaded", function() {
    const mediaGrid = document.getElementById('media-grid');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
    const filterAll = document.getElementById('filterAll');
    const filterEvents = document.getElementById('filterEvents');
    const filterRetreats = document.getElementById('filterRetreats');
    const yearChipsContainer = document.getElementById('yearChips');
    const searchInput = document.getElementById('mediaSearch');

    if (!mediaGrid) {
        // Page doesn't have media grid; nothing to do
        return;
    }

    let allItems = [];
    let currentCategory = 'all'; // 'all' | 'events' | 'retreats'
    let currentYear = 'all';     // 'all' | '2025' | '2024' | ...
    let currentQuery = '';       // lowercase query

    function toLowerSafe(value) {
        return (value || '').toString().toLowerCase();
    }

    function inferAlbumAndYear(tags) {
        const tagsLower = (tags || []).map(toLowerSafe);
        // Year from tags if present
        let yearMatch = tagsLower.join(' ').match(/\b(20\d{2})\b/);
        let year = yearMatch ? yearMatch[1] : undefined;
        let album = 'Community';
        if (tagsLower.includes('womens fall brunch')) {
            album = "Women's Fall Brunch 2024";
            year = '2024';
        } else if (tagsLower.includes('hill christmas store 2023')) {
            album = 'Hill Christmas Store 2023';
            year = '2023';
        } else if (tagsLower.includes('young adults cookout')) {
            album = 'Young Adults Cookout 2025';
            year = '2025';
        }
        return { album, year };
    }

    function buildUnifiedItems(imageGalleryJson, retreatJson) {
        const fromEvents = (imageGalleryJson.images || []).map(img => {
            const { album, year } = inferAlbumAndYear(img.tags || []);
            const category = img.event ? 'events' : 'community';
            const tagsNormalized = [
                ...(img.tags || []).map(toLowerSafe),
                toLowerSafe(album),
                year ? year : ''
            ].filter(Boolean);
            return {
                id: img.id || img.name,
                url: img.url,
                alt: img.name || 'Event photo',
                album,
                year: year || '',
                category,
                tags: tagsNormalized
            };
        });

        const fromRetreat = (retreatJson.images || []).map((img, index) => {
            const filename = img.filename || img.name || `retreat-${index}.jpg`;
            const url = `./assets/retreat2025/${encodeURIComponent(filename)}`;
            const album = 'Fall Retreat 2025';
            const year = '2025';
            const category = 'retreats';
            const tagsNormalized = ['retreat', 'fall retreat', year, toLowerSafe(album)];
            return {
                id: `retreat2025-${index}-${filename}`,
                url,
                alt: img.alt || 'Retreat photo',
                album,
                year,
                category,
                tags: tagsNormalized
            };
        });

        return [...fromEvents, ...fromRetreat];
    }

    function renderYearChips(items) {
        const years = Array.from(
            new Set(items.map(i => i.year).filter(y => y && /^\d{4}$/.test(y)))
        ).sort((a, b) => Number(b) - Number(a));
        yearChipsContainer.innerHTML = '';
        years.forEach(year => {
            const btn = document.createElement('button');
            btn.className = 'filter-chip';
            btn.setAttribute('data-year', year);
            btn.textContent = year;
            btn.addEventListener('click', () => {
                currentYear = currentYear === year ? 'all' : year;
                updateYearActiveState();
                render();
            });
            yearChipsContainer.appendChild(btn);
        });
        updateYearActiveState();
    }

    function updateCategoryActiveState() {
        const buttons = [filterAll, filterEvents, filterRetreats];
        buttons.forEach(btn => {
            if (!btn) return;
            const val = btn.getAttribute('data-category');
            const isActive = (currentCategory === val) || (currentCategory === 'all' && val === 'all');
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    function updateYearActiveState() {
        Array.from(yearChipsContainer.querySelectorAll('.filter-chip')).forEach(btn => {
            const val = btn.getAttribute('data-year');
            const isActive = currentYear === val;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    function applyFilters(items) {
        return items.filter(item => {
            const byCategory = currentCategory === 'all' ? true : item.category === currentCategory;
            const byYear = currentYear === 'all' ? true : item.year === currentYear;
            const byQuery = currentQuery
                ? (toLowerSafe(item.alt).includes(currentQuery) ||
                   toLowerSafe(item.album).includes(currentQuery) ||
                   item.tags.some(t => t.includes(currentQuery)))
                : true;
            return byCategory && byYear && byQuery;
        });
    }

    function clearGrid() {
        while (mediaGrid.firstChild) {
            mediaGrid.removeChild(mediaGrid.firstChild);
        }
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.setAttribute('data-category', item.category);
        if (item.year) card.setAttribute('data-year', item.year);
        card.setAttribute('data-album', item.album);
        card.setAttribute('data-tags', item.tags.join(','));

        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.alt || 'Photo';
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'media-overlay';

        const left = document.createElement('div');
        left.className = 'overlay-left';

        const albumBadge = document.createElement('span');
        albumBadge.className = 'overlay-badge';
        albumBadge.textContent = item.album;

        left.appendChild(albumBadge);
        overlay.appendChild(left);

        if (item.year) {
            const yearBadge = document.createElement('span');
            yearBadge.className = 'overlay-badge';
            yearBadge.textContent = item.year;
            overlay.appendChild(yearBadge);
        }

        card.appendChild(img);
        card.appendChild(overlay);

        card.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = item.url;
            lightboxImg.alt = item.alt || '';
        });

        return card;
    }

    function render() {
        const filtered = applyFilters(allItems);
        clearGrid();
        filtered.forEach(item => {
            mediaGrid.appendChild(createCard(item));
        });
    }

    // Wire category filter buttons
    if (filterAll) {
        filterAll.addEventListener('click', () => {
            currentCategory = 'all';
            updateCategoryActiveState();
            render();
        });
    }
    if (filterEvents) {
        filterEvents.addEventListener('click', () => {
            currentCategory = 'events';
            updateCategoryActiveState();
            render();
        });
    }
    if (filterRetreats) {
        filterRetreats.addEventListener('click', () => {
            currentCategory = 'retreats';
            updateCategoryActiveState();
            render();
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = toLowerSafe(e.target.value).trim();
            render();
        });
    }

    // Lightbox closing
    if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target !== lightboxImg) {
                    lightbox.style.display = 'none';
                }
            });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                lightbox.style.display = 'none';
            }
        });
    }

    // Load data
    Promise.all([
        fetch('data/image-gallery.json').then(r => r.json()).catch(() => ({ images: [] })),
        fetch('data/retreat2025-images.json').then(r => r.json()).catch(() => ({ images: [] }))
    ]).then(([eventsJson, retreatJson]) => {
        allItems = buildUnifiedItems(eventsJson, retreatJson);
        renderYearChips(allItems);
        updateCategoryActiveState();
        render();
    }).catch(error => {
        console.error('Error loading gallery data:', error);
    });
});
