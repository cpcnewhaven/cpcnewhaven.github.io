/**
 * Highlights Display System
 * Fetches and displays highlights from highlights.json
 */

class HighlightsManager {
    constructor() {
        this.dataUrl = './data/announcements/highlights.json';
        this.container = document.querySelector('#highlights .highlights-content');
        this.init();
    }

    async init() {
        try {
            if (!this.container) {
                console.warn('Highlights container not found. Looking for: #highlights .highlights-content');
                return;
            }
            await this.loadHighlights();
        } catch (error) {
            console.error('Failed to initialize highlights:', error);
            this.displayError();
        }
    }

    async loadHighlights() {
        // Add version parameter for cache-busting (update this when highlights.json changes)
        // Using timestamp of last major update: 2026-01-30
        const cacheBuster = `?v=20260130`;
        const response = await fetch(this.dataUrl + cacheBuster);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Loaded ${data.announcements?.length || 0} announcements from highlights.json`);
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

        console.log(`Filtered to ${sortedAnnouncements.length} active announcements (from ${announcements.length} total)`);

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
            
            // Check if this is an ongoing announcement (should always be shown if active)
            const isOngoing = announcement.type === 'ongoing' || announcement.category === 'ongoing';
            if (isOngoing) {
                return true; // Keep ongoing announcements regardless of date
            }
            
            // For event-type announcements, try to parse dates from title or description
            if (announcement.type === 'event' || announcement.category === 'event') {
                const eventDate = this.parseEventDateFromContent(announcement);
                if (eventDate) {
                    // If we found an event date, check if it's in the past
                    // Events beyond today's date should be filtered out (unless ongoing)
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
        
        // Map month names to numbers (handle both with and without periods)
        const monthMap = {
            'jan': 0, 'jan.': 0, 'january': 0, 'feb': 1, 'feb.': 1, 'february': 1,
            'mar': 2, 'mar.': 2, 'march': 2, 'apr': 3, 'apr.': 3, 'april': 3,
            'may': 4, 'jun': 5, 'jun.': 5, 'june': 5, 'jul': 6, 'jul.': 6, 'july': 6,
            'aug': 7, 'aug.': 7, 'august': 7, 'sep': 8, 'sep.': 8, 'sept': 8, 'sept.': 8, 'september': 8,
            'oct': 9, 'oct.': 9, 'october': 9, 'nov': 10, 'nov.': 10, 'november': 10,
            'dec': 11, 'dec.': 11, 'december': 11
        };
        
        const currentYear = new Date().getFullYear();
        
        // First, try to match "the Xth of Month" format (e.g., "the 13th of December")
        const theXthOfMonth = text.match(/the\s+(\d{1,2})(?:st|nd|rd|th)?\s+of\s+(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)/i);
        if (theXthOfMonth) {
            const day = parseInt(theXthOfMonth[1]);
            const monthMatch = text.match(/the\s+\d{1,2}(?:st|nd|rd|th)?\s+of\s+((?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August))/i);
            if (monthMatch) {
                const monthName = monthMatch[1].toLowerCase();
                const month = monthMap[monthName];
                if (month !== undefined) {
                    return new Date(currentYear, month, day);
                }
            }
        }
        
        // Try date ranges with year (e.g., "Oct 10-12, 2025" or "Saturday October 10-12, 2025")
        const dateRangeWithYear = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)\s+(\d{1,2})-(\d{1,2}),?\s+(\d{4})/i);
        if (dateRangeWithYear) {
            const monthMatch = dateRangeWithYear[0].match(/(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)/i);
            if (monthMatch) {
                const monthName = monthMatch[0].toLowerCase();
                const month = monthMap[monthName];
                if (month !== undefined) {
                    const endDay = parseInt(dateRangeWithYear[2]);
                    const year = parseInt(dateRangeWithYear[3]);
                    return new Date(year, month, endDay);
                }
            }
        }
        
        // Check for date ranges without year (e.g., "Oct 10-12" or "Saturday October 10-12")
        const dateRange = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)\s+(\d{1,2})-(\d{1,2})/i);
        if (dateRange) {
            const monthMatch = dateRange[0].match(/(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)/i);
            if (monthMatch) {
                const monthName = monthMatch[0].toLowerCase();
                const month = monthMap[monthName];
                if (month !== undefined) {
                    const endDay = parseInt(dateRange[2]);
                    return new Date(currentYear, month, endDay);
                }
            }
        }
        
        // Try single dates with year (e.g., "Sept. 28, 2025" or "Saturday December 13, 2025")
        const dateWithYear = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)\s+(\d{1,2}),?\s+(\d{4})/i);
        if (dateWithYear) {
            const monthMatch = dateWithYear[0].match(/(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)/i);
            if (monthMatch) {
                const monthName = monthMatch[0].toLowerCase();
                const month = monthMap[monthName];
                if (month !== undefined) {
                    const day = parseInt(dateWithYear[1]);
                    const year = parseInt(dateWithYear[2]);
                    return new Date(year, month, day);
                }
            }
        }
        
        // Finally, try single dates without year (e.g., "Sept. 28" or "Saturday December 13" or "Saturday, January 24")
        // Updated to handle commas after day names
        const dateWithoutYear = text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?,?\s*(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)\s+(\d{1,2})(?!-)/i);
        if (dateWithoutYear) {
            const monthMatch = dateWithoutYear[0].match(/(?:Sept\.?|September|Oct\.?|October|Nov\.?|November|Dec\.?|December|Jan\.?|January|Feb\.?|February|Mar\.?|March|Apr\.?|April|May|Jun\.?|June|Jul\.?|July|Aug\.?|August)/i);
            if (monthMatch) {
                const monthName = monthMatch[0].toLowerCase();
                const month = monthMap[monthName];
                if (month !== undefined) {
                    const day = parseInt(dateWithoutYear[1]);
                    return new Date(currentYear, month, day);
                }
            }
        }
        
        // Also try numeric date formats like "1/17" or "1/17/26" (month/day or month/day/year)
        const numericDate = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
        if (numericDate) {
            const month = parseInt(numericDate[1]) - 1; // JavaScript months are 0-indexed
            const day = parseInt(numericDate[2]);
            const year = numericDate[3] ? 
                (numericDate[3].length === 2 ? 2000 + parseInt(numericDate[3]) : parseInt(numericDate[3])) : 
                currentYear;
            if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                return new Date(year, month, day);
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
        image.decoding = 'async';
        
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
// Handle both cases: script loaded before or after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HighlightsManager();
    });
} else {
    // DOM is already loaded, initialize immediately
    new HighlightsManager();
}


