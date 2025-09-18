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
        const today = new Date('2025-09-16'); // Set today's date
        
        return announcements.filter(announcement => {
            // First check if announcement is active
            const isActive = announcement.active === "true" || announcement.active === true;
            if (!isActive) return false;
            
            // For event-type announcements, try to parse dates from title
            if (announcement.type === 'event' || announcement.category === 'event') {
                const eventDate = this.parseEventDateFromTitle(announcement.title);
                if (eventDate) {
                    // If we found an event date, check if it's in the past
                    return eventDate >= today;
                }
            }
            
            // For other announcements, use dateEntered as fallback
            // Only filter out very old announcements (older than 6 months)
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const dateEntered = new Date(announcement.dateEntered || '1970-01-01');
            
            return dateEntered >= sixMonthsAgo;
        });
    }

    parseEventDateFromTitle(title) {
        // Common date patterns in titles
        const datePatterns = [
            /(?:Sept\.?|September)\s+(\d{1,2})/i,
            /(?:Oct\.?|October)\s+(\d{1,2})/i,
            /(?:Nov\.?|November)\s+(\d{1,2})/i,
            /(?:Dec\.?|December)\s+(\d{1,2})/i,
            /(?:Jan\.?|January)\s+(\d{1,2})/i,
            /(?:Feb\.?|February)\s+(\d{1,2})/i,
            /(?:Mar\.?|March)\s+(\d{1,2})/i,
            /(?:Apr\.?|April)\s+(\d{1,2})/i,
            /(?:May)\s+(\d{1,2})/i,
            /(?:Jun\.?|June)\s+(\d{1,2})/i,
            /(?:Jul\.?|July)\s+(\d{1,2})/i,
            /(?:Aug\.?|August)\s+(\d{1,2})/i
        ];

        for (const pattern of datePatterns) {
            const match = title.match(pattern);
            if (match) {
                const day = parseInt(match[1]);
                const monthName = match[0].split(/\s+/)[0].toLowerCase();
                
                // Map month names to numbers
                const monthMap = {
                    'jan': 0, 'january': 0, 'feb': 1, 'february': 1,
                    'mar': 2, 'march': 2, 'apr': 3, 'april': 3,
                    'may': 4, 'jun': 5, 'june': 5, 'jul': 6, 'july': 6,
                    'aug': 7, 'august': 7, 'sep': 8, 'sept': 8, 'september': 8,
                    'oct': 9, 'october': 9, 'nov': 10, 'november': 10,
                    'dec': 11, 'december': 11
                };
                
                const month = monthMap[monthName];
                if (month !== undefined) {
                    // Assume current year (2025) for events
                    const eventDate = new Date(2025, month, day);
                    return eventDate;
                }
            }
        }
        
        return null;
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
