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
        const cacheBuster = `?v=20261030-3`;
        const response = await fetch(this.dataUrl + cacheBuster, { cache: 'no-cache' });

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

        // Filter and sort announcements
        const activeAnnouncements = this.filterActiveAnnouncements(announcements);
        const sortedAnnouncements = this.sortAnnouncements(activeAnnouncements);

        console.log(`Filtered to ${sortedAnnouncements.length} active announcements`);

        // Handle General Section
        this.container.innerHTML = '';
        const posters = sortedAnnouncements.filter(item => item.featuredImage);
        const notices = sortedAnnouncements.filter(item => !item.featuredImage);
        [posters, notices].forEach((items, index) => {
            if (!items.length) return;
            const group = document.createElement('div');
            group.className = index === 0 ? 'highlights-poster-grid' : 'highlights-notice-grid';
            items.forEach(item => group.appendChild(this.createAnnouncementElement(item)));
            this.container.appendChild(group);
        });

        // Add no content message if no announcements
        if (sortedAnnouncements.length === 0) {
            this.displayNoContent();
        }
    }

    filterActiveAnnouncements(announcements) {
        // Use the church's calendar day, including for visitors in other time zones.
        const churchDay = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(new Date());
        const [year, month, day] = churchDay.split('-').map(Number);
        const today = new Date(year, month - 1, day);
        const localDate = value => new Date(`${value}T00:00:00`);

        return announcements.filter(announcement => {
            // First check if announcement is active
            const isActive = announcement.active === "true" || announcement.active === true;
            if (!isActive) return false;

            // Explicit dates apply to every notice, including ongoing classes.
            if (announcement.expiresAt && localDate(announcement.expiresAt) < today) return false;
            if (announcement.eventDate && localDate(announcement.eventDate) < today) return false;

            const isOngoing = announcement.type === 'ongoing' || announcement.category === 'ongoing';
            if (isOngoing) return true;

            // Handle "This Sunday" announcements automatically
            if (/this sunday/i.test(announcement.title) || /this sunday/i.test(announcement.description)) {
                if (announcement.dateEntered) {
                    const entered = localDate(announcement.dateEntered);
                    const daysUntilSunday = (7 - entered.getDay()) % 7;
                    const sundayDate = new Date(entered);
                    sundayDate.setDate(sundayDate.getDate() + daysUntilSunday);
                    sundayDate.setHours(23, 59, 59, 999);
                    if (sundayDate < today) return false;
                }
            }

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
        // If explicit eventDate is provided, parse it
        if (announcement.eventDate) {
            const parts = announcement.eventDate.split('-').map(Number);
            if (parts.length === 3) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
        }

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
        element.className = `highlight-card ${announcement.featuredImage ? 'has-poster' : 'text-notice'} ${announcement.type || 'announcement'}`;

        // Add featured image if available
        if (announcement.featuredImage) {
            const imageContainer = this.createImageContainer(announcement.featuredImage, announcement.imageDisplayType, announcement.imageAlt);
            element.appendChild(imageContainer);
        }

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'highlight-content';

        const label = document.createElement('p');
        label.className = 'highlight-label';
        const labels = { worship: 'Worship', membership: 'Membership', mercy: 'Serving', ongoing: 'Church life', event: 'Gathering' };
        label.textContent = labels[announcement.category] || 'Announcement';
        const date = announcement.eventDate || announcement.expiresAt;
        if (date) {
            const [year, month, day] = date.split('-').map(Number);
            const displayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
                .format(new Date(year, month - 1, day));
            label.textContent += ` · ${announcement.eventDate ? '' : 'Through '}${displayDate}`;
        }
        contentContainer.appendChild(label);

        // Add title
        const title = document.createElement('h3');
        title.className = 'highlight-title';
        title.textContent = announcement.title;
        contentContainer.appendChild(title);

        // Add description
        const description = document.createElement('div');
        description.className = 'highlight-description';
        description.innerHTML = announcement.description;

        // If this is an event with a date, add an "Add to Calendar" link
        if (announcement.type === 'event' || announcement.category === 'event' || announcement.eventDate) {
            const eventDate = this.parseEventDateFromContent(announcement);
            if (eventDate) {
                const calLink = this.createGoogleCalendarLink(announcement, eventDate);
                if (calLink) {
                    description.appendChild(calLink);
                }
            }
        }

        contentContainer.appendChild(description);

        element.appendChild(contentContainer);
        return element;
    }

    createGoogleCalendarLink(announcement, eventDate) {
        if (!eventDate || isNaN(eventDate.getTime())) return null;

        const pad = (n) => String(n).padStart(2, '0');
        const startStr = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}`;

        // Check if time is mentioned in title or description (e.g. 10:30am, 7-8pm, 9am-11:30am)
        const combinedText = `${announcement.title} ${announcement.description || ''}`;
        const timeMatch = combinedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
        let datesParam = `${startStr}/${startStr}`;

        if (announcement.startTime && announcement.endTime) {
            const start = announcement.startTime.replace(':', '') + '00';
            const end = announcement.endTime.replace(':', '') + '00';
            datesParam = `${startStr}T${start}/${startStr}T${end}`;
        } else if (timeMatch) {
            let hour = parseInt(timeMatch[1], 10);
            const min = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
            const ampm = timeMatch[3].toLowerCase();
            if (ampm === 'pm' && hour < 12) hour += 12;
            if (ampm === 'am' && hour === 12) hour = 0;

            const dt = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hour, min);
            const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // 2-hour default duration
            const toUtcIso = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
            datesParam = `${toUtcIso(dt)}/${toUtcIso(endDt)}`;
        } else {
            const nextDay = new Date(eventDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;
            datesParam = `${startStr}/${nextDayStr}`;
        }

        const cleanTitle = announcement.title.replace(/<[^>]*>/g, '').trim();
        const cleanDesc = announcement.description ? announcement.description.replace(/<[^>]*>/g, '').trim() : '';
        const location = '135 Whitney Ave, New Haven, CT 06510';

        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(cleanTitle)}&dates=${datesParam}&ctz=America%2FNew_York&details=${encodeURIComponent(cleanDesc)}&location=${encodeURIComponent(location)}`;

        const link = document.createElement('a');
        link.href = gcalUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'highlight-calendar-btn';
        link.innerHTML = '<i class="far fa-calendar-plus" aria-hidden="true"></i> Add to Calendar';
        return link;
    }

    createImageContainer(imageUrl, imageDisplayType, imageAlt) {
        const container = document.createElement('a');
        container.className = 'highlight-image-container';
        container.href = imageUrl;
        container.target = '_blank';
        container.rel = 'noopener';
        container.setAttribute('aria-label', 'View announcement poster at full size');

        // Add special class for poster display type
        if (imageDisplayType === 'poster') {
            container.classList.add('poster-display');
        }

        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = imageAlt || 'Announcement poster';
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
