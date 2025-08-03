/**
 * Highlights Display System
 * Fetches and displays highlights from highlights.json
 */

class HighlightsManager {
    constructor() {
        this.dataUrl = './data/announcements/highlights.json';
        this.container = document.getElementById('highlights');
        this.init();
    }

    async init() {
        try {
            await this.loadHighlights();
        } catch (error) {
            console.error('Failed to initialize highlights:', error);
            this.displayError();
        }
    }

    async loadHighlights() {
        const response = await fetch(this.dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.renderHighlights(data.announcements);
    }

    renderHighlights(announcements) {
        if (!this.container) {
            console.error('Highlights container not found');
            return;
        }

        // Clear existing content
        this.container.innerHTML = '';

        // Filter and sort announcements
        const activeAnnouncements = this.filterActiveAnnouncements(announcements);
        const sortedAnnouncements = this.sortAnnouncements(activeAnnouncements);

        // Render all announcements with unified styling
        sortedAnnouncements.forEach(announcement => {
            const element = this.createAnnouncementElement(announcement);
            this.container.appendChild(element);
        });

        // Add no content message if no announcements
        if (sortedAnnouncements.length === 0) {
            this.displayNoContent();
        }
    }

    filterActiveAnnouncements(announcements) {
        return announcements.filter(announcement => 
            announcement.active === "true" || announcement.active === true
        );
    }

    sortAnnouncements(announcements) {
        return announcements.sort((a, b) => {
            // Sort by date entered (newest first)
            const dateA = new Date(a.dateEntered || '1970-01-01');
            const dateB = new Date(b.dateEntered || '1970-01-01');
            return dateB - dateA;
        });
    }

    createAnnouncementElement(announcement) {
        const element = document.createElement('article');
        element.className = `highlight-card ${announcement.type || 'announcement'}`;
        
        // Add featured image if available
        if (announcement.featuredImage) {
            const imageContainer = this.createImageContainer(announcement.featuredImage);
            element.appendChild(imageContainer);
        }

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'highlight-content';

        // Add title
        const title = document.createElement('h3');
        title.className = 'highlight-title';
        title.textContent = announcement.title;
        contentContainer.appendChild(title);

        // Add description
        const description = document.createElement('div');
        description.className = 'highlight-description';
        description.innerHTML = announcement.description;
        contentContainer.appendChild(description);

        // Add metadata if available
        if (announcement.dateEntered) {
            const metadata = this.createMetadata(announcement);
            contentContainer.appendChild(metadata);
        }

        element.appendChild(contentContainer);
        return element;
    }

    createImageContainer(imageUrl) {
        const container = document.createElement('div');
        container.className = 'highlight-image-container';
        
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = 'Highlight image';
        image.className = 'highlight-image';
        image.loading = 'lazy';
        
        // Handle image loading errors
        image.onerror = () => {
            container.style.display = 'none';
        };
        
        container.appendChild(image);
        return container;
    }

    createMetadata(announcement) {
        const metadata = document.createElement('div');
        metadata.className = 'highlight-metadata';
        
        const date = new Date(announcement.dateEntered);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        metadata.innerHTML = `
            <span class="highlight-date">${formattedDate}</span>
            ${announcement.tag ? `<span class="highlight-tag">${announcement.tag}</span>` : ''}
        `;
        
        return metadata;
    }

    displayError() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="highlight-error">
                    <p>Unable to load highlights at this time. Please check back later.</p>
                </div>
            `;
        }
    }

    displayNoContent() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="highlight-empty">
                    <p>No highlights available at this time.</p>
                </div>
            `;
        }
    }
}

// Initialize highlights when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HighlightsManager();
});

// Add styles for highlights with fixed width and variable height
const highlightStyles = `
    #highlights {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px 0;
    }

    .highlights-content {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .highlight-card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid #003c6d;
        width: 100%;
        max-width: 600px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
    }

    .highlight-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .highlight-image-container {
        width: 100%;
        height: 200px;
        overflow: hidden;
        flex-shrink: 0;
    }

    .highlight-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .highlight-card:hover .highlight-image {
        transform: scale(1.05);
    }

    .highlight-content {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .highlight-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #003c6d;
        margin: 0 0 1rem 0;
        line-height: 1.3;
    }

    .highlight-description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
        flex: 1;
    }

    .highlight-description ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }

    .highlight-description li {
        margin-bottom: 0.25rem;
    }

    .highlight-description a {
        color: #003c6d;
        text-decoration: none;
        font-weight: 500;
    }

    .highlight-description a:hover {
        text-decoration: underline;
        color: #002244;
    }

    .highlight-metadata {
        display: flex;
        gap: 1rem;
        align-items: center;
        font-size: 0.875rem;
        color: #888;
        border-top: 1px solid #eee;
        padding-top: 1rem;
        margin-top: auto;
        flex-shrink: 0;
    }

    .highlight-tag {
        background: #e6f0ff;
        color: #003c6d;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 500;
        border: 1px solid #003c6d;
    }

    .highlight-error,
    .highlight-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
        background: #f9f9f9;
        border-radius: 8px;
        margin: 2rem 0;
        width: 100%;
        max-width: 600px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .highlight-card {
            margin-bottom: 1.5rem;
            max-width: 100%;
        }

        .highlight-content {
            padding: 1rem;
        }

        .highlight-title {
            font-size: 1.25rem;
        }

        .highlight-image-container {
            height: 150px;
        }

        .highlight-metadata {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }

    /* Animation for new highlights */
    .highlight-card {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = highlightStyles;
document.head.appendChild(styleSheet);
