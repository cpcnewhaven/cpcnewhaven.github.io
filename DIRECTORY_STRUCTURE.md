# CPC New Haven Repository Directory & Architecture Reference

This document maps all files, folders, and data structures in `cpcnewhaven.github.io` for porting into the new `cpc-web-app`.

---

## 1. Top-Level Summary

| Directory / File Category | Description |
|---|---|
| `*.html` (43 files) | Static page routes for the website. |
| `data/` | JSON data stores for sermons, podcasts, events, announcements, handouts, and search. |
| `src/js/` & `src/` | Client-side JavaScript modules, dynamic fetchers, and UI behaviors. |
| `src/css/` | Component and page-level modular stylesheets. |
| `sunday-studies/` | Adult Sunday School course pages and PDF handouts. |
| `assets/` & `static/` | Logos, portraits, background imagery, map graphics, and thumbnails. |
| `scripts/` | Python/Node maintenance scripts (search index builder, calendar sync, image optimization). |
| `admin/` | Internal administrative utilities (Google Drive extractor, retreat manager). |
| `archive/` | Historical versions of pages and past data archives. |
| `live/` | Dedicated livestream viewer page and accompanying scripts. |
| `lifegroups/` | Standalone lifegroup interactive locator page and map assets. |

---

## 2. Page Routes (`*.html`)

### Core & Navigation
- `index.html` - Homepage (banner, hero splash, upcoming sermon, recent sermons, Beyond podcast widget, news highlights)
- `about.html` - Beliefs, 5 Marks, staff list with emails, Session, WLB, and SLB rosters
- `sundays.html` - Sunday morning overview, worship times, nursery, directions
- `worship.html` - Worship service order, liturgy, and theology of worship
- `community.html` - Life Groups, Discipleship Groups, Men's/Women's ministries
- `connect.html` - Connect hub with pastoral contacts and welcome information
- `contact.html` - Contact form and office hours
- `give.html` - Giving options (online giving, checks, stocks)
- `resources.html` - Central Resource Directory, active events, and Past Events & Archive
- `forms.html` - Directory of church registration forms and surveys
- `search.html` - Full-text site search page using Lunr.js / `data/search-index.json`
- `updates.html` - Website changelog and technical updates
- `site.webmanifest` & `sw.js` - PWA manifest and service worker

### Sermons & Podcasts
- `sunday-sermons.html` - Audio sermon catalog with series filtering, player, and Scripture text
- `podcasts.html` - Podcast series index page (Beyond the Sunday Sermon, Sunday Studies, etc.)
- `beyond-podcast.html` - Dedicated "Beyond the Sunday Sermon" podcast player
- `full-podcast-monte.html` - Legacy comprehensive podcast archive
- `past-services.html` - Historical bulletin archives and past liturgy links

### Community & Discipleship
- `lifegroup.html` - Small group listings, neighborhoods, leaders, and meeting times
- `discipleship.html` - Discipleship groups, curriculum, and registration
- `membership.html` - Membership seminar info, vows, and Church Community Builder (CCB) login
- `cpc-care-teams.html` - Care team ministries, mercy meal coordinators, and contact forms
- `mercy.html` - Mercy Ministry resources, Mercy Day registration, and volunteer contacts
- `mission-anabaino.html` - Mission Anabaino church planting network info
- `get-started-groups.html` - Group onboarding and sign-up landing page

### Adult Sunday Studies & Classes
- `adult-sunday-school.html` - Overview of adult Sunday school classes
- `classes.html` - Class directory with audio and handout links
- `christian-leadership-training.html` - CLT curriculum and reading material
- `what-we-believe.html` - Introduction to Reformed theology and WCF
- `sinai.html` & `walking.html` - Walking Through Sinai study page
- `engaging-with-aging.html` - Senior care and aging discussion series
- `sunday-studies/` (subfolder):
  - `sunday-studies/biblical-interpretation.html`
  - `sunday-studies/confessional-theology.html`
  - `sunday-studies/emotions-spirituality.html`
  - `sunday-studies/mission-study.html`
  - `sunday-studies/total-christ.html`
  - `sunday-studies/walking-through-sinai.html`
  - `sunday-studies/what-we-believe.html`
  - `sunday-studies/wonders-of-communal-worship.html`

### Events & Special Pages
- `events.html` - Calendar of events, regular weekly schedule, and Pastor Drop-in Office Hours
- `announcements.html` & `past-announcements.html` - Church announcements and bulletin items
- `cpc-womens-conference-2026-10-03.html` - CPC Women's Conference landing page
- `congregational-meeting-2026-08-30.html` & `congregational-meeting.html` - Meeting notices and slides
- `welcome-sunday-2026-09-13.html` - Welcome Sunday celebration details
- `2025-missions-trip.html` - 2025 Missions Trip details
- `retreat2025.html` & `cpc-retreat.html` - Church Retreat schedules and info
- `media.html` - Photo galleries and video streams
- `pastor-craig.html` & `pastor-jerry.html` - Pastor bios and personal contact info
- `a-c-c.html` - Admin Control Center link hub

---

## 3. Data Layer (`data/`)

All structured data is maintained in JSON format:

```
data/
├── announcements/
│   ├── highlights.json           # Active announcements and bulletin highlights
│   ├── oldHighlights.json        # Archived announcement items
│   └── ongoingEvents.json        # Recurring schedules (Drop-in hours, Sunday schedule)
├── podcasts/
│   ├── biblical-interpretation.json
│   ├── compline-homilies.json
│   ├── confessional-theology.json
│   ├── emotions-spirituality.json
│   ├── membership-seminar.json
│   └── mission-study.json
├── wwb/
│   ├── wwb-data.json             # What We Believe class outlines
│   └── wwb1.pdf ... wwb30.pdf    # Class handout PDFs
├── banner-content.json           # Global sitewide notification banner text
├── beyond-podcast.json           # Beyond the Sunday Sermon episodes
├── events.json                   # Google Calendar event cache (synced via script)
├── homepage-upcoming-sermon.json # Next upcoming Sunday sermon title, preacher, scripture
├── image-gallery.json            # Curated image collections and metadata
├── instagram-feed.json           # Instagram feed posts
├── past-services.json            # Previous worship bulletins and liturgy records
├── podcast-index.json            # Master listing of all podcast series
├── resources.json                # Directory of church forms, tools, and external services
├── retreat2025-images.json       # Retreat photo gallery data
├── search-index.json             # Pre-built search index (generated by Python script)
├── search-manifest.json          # Search index build timestamp and source list
├── sunday-sermons.json           # Sunday morning sermons (audio URLs, titles, dates, series)
└── upcomingSermon.json           # Secondary upcoming sermon metadata
```

---

## 4. Frontend Stylesheets (`src/css/`)

Modular CSS files loaded per-page or globally:

```
src/css/
├── global-body.css               # Typography, color variables, reset, header/nav styles
├── global-footer-cta.css         # Newsletter subscription footer CTA
├── global-connect-menu.css       # Navigation connect dropdown menu
├── index-page.css                # Homepage hero, cards, and section styling
├── splash-header.css             # Full-bleed splash banners with parallax
├── about-page.css & about.css    # Staff grid, leadership cards, philosophy layout
├── events.css                    # Calendar cards, schedules, monthly groups
├── lifegroup.css                 # Life group grid, filter pills, leader tags
├── podcasts.css                  # Podcast series cards and episode listings
├── podcasts-classes.css          # Sunday school audio player and curriculum
├── beyond-widget.css             # Homepage "We Are Back!" Beyond the Sermon widget
├── sunday.css & worship.css      # Sunday morning page and liturgical structure
├── sunday-studies.css            # Class study listings and PDF downloads
├── resources.css                 # Resource directory grid and category cards
├── highlights.css                # Bulletin announcements and alert banners
├── whats-new.css                 # Changelog and recent updates layout
├── search.css                    # Search input, results styling, and highlights
├── media-gallery.css             # Image lightbox and photo gallery
├── live.css                      # YouTube livestream video container
├── footer.css                    # Bottom footer copyright and quick links
├── brochure-style.css            # Print/brochure style views
└── upcoming-worship-preview.css  # Upcoming Sunday morning hero preview banner
```

---

## 5. Client JavaScript (`src/js/` & `src/`)

```
src/
├── announcements.js              # Renders active highlights and announcements
├── fetch-about.js                # Loads dynamic about data if needed
├── fetch-event-full.js           # Event details modal / expansion
├── fetch-events.js               # Fetches upcoming and ongoing events
├── fetch-podcast-full.js         # Single episode podcast player handler
├── homepage-display-sermon.js    # Injects upcoming sermon details into homepage
├── nav-code.js                   # Mobile navigation hamburger toggle and dropdowns
└── js/
    ├── back-home-button.js       # Floating back-to-home button on subpages
    ├── background-fetch-splash-image.js # Dynamic splash hero image rotator
    ├── background-parallax-magic.js     # Smooth parallax scrolling effects
    ├── beyond-podcast.js         # Beyond the Sermon podcast series viewer
    ├── beyond-widget.js          # Homepage widget rendering 3 latest Beyond episodes
    ├── classes.js                # Adult Sunday School class tab switcher
    ├── clear-cache.js            # Client-side cache busting helper
    ├── dynamic-banner.js         # Dismissible sitewide alert banner
    ├── fetch-events-preview.js   # Mini upcoming events widget
    ├── fetch-podcasts.js         # Master podcast catalog parser
    ├── highlights.js             # Highlights renderer with category filters
    ├── homepage-fetch-latestPodcasts.js # Homepage recent sermons feed
    ├── homepage-upcoming-sermon.js # Homepage sermon preview logic
    ├── live-logic.js             # Livestream embed status and live checks
    ├── populate-ongoing-events.js # Injects ongoing events from JSON
    ├── site-search.js            # Client search engine (Lunr / JSON query)
    ├── sunday-sermons.js         # Sunday sermon audio player and filter
    └── whats-new.js              # Renders updates and version notes
```

---

## 6. Handouts & Downloads (`sunday-studies/handouts/`)

PDF study materials organized by topic:
- `Total Christ SS Schedule_2025.pages.pdf`, `Total Christ SS_1_Intro_2025.pages.pdf`, `Total Christ SS_2_Gospel-centered_2025.pages.pdf`
- `clt/` (Christian Leadership Training): `CLT_1.pdf`, `Keller_centrality gospel.pdf`
- `mission/`: `Mission_SS_2026_1.pdf`
- `totalchrist/`: `1_TC.pdf` through `6_TC.pdf`
- `worship/`: `Worship_SS_1_Intro_Theology_2026.pdf`
- `data/wwb/`: What We Believe booklets (`wwb1.pdf` through `wwb30.pdf`)

---

## 7. Assets & Media (`assets/` & `static/`)

```
assets/
├── CPC LOGO.png / cpcLOGO.png / CPC_LOGO_24.png / CPC_LOGO_24.svg # Logos
├── CraigLuekens.png & jerryOrnelas.png                           # Pastor portraits
├── CPC_YOUTUBE_DEFAULT.jpg                                      # Default video poster
├── cpcPodcasts.png                                              # Podcast badge
├── homepage-backgrounds/                                        # Homepage hero carousel
├── podcast-thumbnails/                                          # Artwork per series
├── retreat2025/                                                 # Retreat photos
├── websiteBG/ & websiteSan/                                     # Historic building photos
└── websiteBG-events/ & websiteBG-podcasts/                      # Section headers

intro-music-options/
├── Come-Thou-Fount-of-Every-Blessing.mp3
├── O-Worship-the-King.mp3
└── This-Is-My-Fathers-World.mp3
```

---

## 8. Build & Sync Scripts (`scripts/`)

- `scripts/build-search-index.py` - Parses HTML pages and JSON data into `data/search-index.json`.
- `scripts/update-calendar-events.py` - Fetches events from CPC Google Calendar into `data/events.json`.
- `scripts/fetch_past_services.py` - Pulls past bulletins and worship services.
- `scripts/compress-images.js` & `scripts/optimize-images.sh` - Asset compression.
- `scripts/update-instagram-feed.js` - Syncs Instagram posts into `data/instagram-feed.json`.
- `scripts/update-retreat-gallery.js` - Syncs retreat gallery images.
