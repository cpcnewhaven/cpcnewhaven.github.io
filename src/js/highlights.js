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
        const today = new Date(); // Use current date
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        return announcements.filter(announcement => {
            // First check if announcement is active
            const isActive = announcement.active === "true" || announcement.active === true;
            if (!isActive) return false;
            
            // For event-type announcements, try to parse dates from title or description
            if (announcement.type === 'event' || announcement.category === 'event') {
                const eventDate = this.parseEventDateFromContent(announcement);
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

    parseEventDateFromContent(announcement) {
        // First try to parse from title
        let eventDate = this.parseEventDateFromTitle(announcement.title);
        if (eventDate) return eventDate;
        
        // Then try to parse from description
        eventDate = this.parseEventDateFromTitle(announcement.description);
        if (eventDate) return eventDate;
        
        return null;
    }

    parseEventDateFromTitle(text) {
        if (!text) return null;
        
        // Common date patterns in titles and descriptions
        const datePatterns = [
            // Patterns with year (e.g., "Sept. 28, 2025" or "September 28, 2025")
            /(?:Sept\.?|September)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Oct\.?|October)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Nov\.?|November)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Dec\.?|December)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Jan\.?|January)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Feb\.?|February)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Mar\.?|March)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Apr\.?|April)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:May)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Jun\.?|June)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Jul\.?|July)\s+(\d{1,2}),?\s+(\d{4})/i,
            /(?:Aug\.?|August)\s+(\d{1,2}),?\s+(\d{4})/i,
            
            // Patterns without year (assume current year)
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
            /(?:Aug\.?|August)\s+(\d{1,2})/i,
            
            // Date range patterns (e.g., "Oct 10-12")
            /(?:Sept\.?|September)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Oct\.?|October)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Nov\.?|November)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Dec\.?|December)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Jan\.?|January)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Feb\.?|February)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Mar\.?|March)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Apr\.?|April)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:May)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Jun\.?|June)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Jul\.?|July)\s+(\d{1,2})-(\d{1,2})/i,
            /(?:Aug\.?|August)\s+(\d{1,2})-(\d{1,2})/i
        ];

        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) {
                const monthName = match[0].split(/\s+/)[0].toLowerCase();
                
                // Map month names to numbers (handle both with and without periods)
                const monthMap = {
                    'jan': 0, 'jan.': 0, 'january': 0, 'feb': 1, 'feb.': 1, 'february': 1,
                    'mar': 2, 'mar.': 2, 'march': 2, 'apr': 3, 'apr.': 3, 'april': 3,
                    'may': 4, 'jun': 5, 'jun.': 5, 'june': 5, 'jul': 6, 'jul.': 6, 'july': 6,
                    'aug': 7, 'aug.': 7, 'august': 7, 'sep': 8, 'sep.': 8, 'sept': 8, 'sept.': 8, 'september': 8,
                    'oct': 9, 'oct.': 9, 'october': 9, 'nov': 10, 'nov.': 10, 'november': 10,
                    'dec': 11, 'dec.': 11, 'december': 11
                };
                
                const month = monthMap[monthName];
                if (month !== undefined) {
                    // Check if we have a year in the match
                    if (match[2]) {
                        // Has year
                        const year = parseInt(match[2]);
                        const day = parseInt(match[1]);
                        const eventDate = new Date(year, month, day);
                        return eventDate;
                    } else if (match[2] && match[3]) {
                        // Date range - use the start date
                        const currentYear = new Date().getFullYear();
                        const day = parseInt(match[1]);
                        const eventDate = new Date(currentYear, month, day);
                        return eventDate;
                    } else {
                        // No year - assume current year
                        const currentYear = new Date().getFullYear();
                        const day = parseInt(match[1]);
                        const eventDate = new Date(currentYear, month, day);
                        return eventDate;
                    }
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
            const imageContainer = this.createImageContainer(announcement.featuredImage, announcement.imageDisplayType);
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

    createImageContainer(imageUrl, imageDisplayType) {
        const container = document.createElement('div');
        container.className = 'highlight-image-container';
        
        // Add special class for poster display type
        if (imageDisplayType === 'poster') {
            container.classList.add('poster-display');
        }
        
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
