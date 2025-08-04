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
