// Mobile navigation toggle - resilient across page variants
document.addEventListener('DOMContentLoaded', function () {
  // Ensure a web manifest is present (helps installability / best-practice Lighthouse checks).
  // We inject it here so we don't have to edit every HTML page head.
  try {
    const hasManifest = document.querySelector('link[rel="manifest"]');
    if (!hasManifest) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'manifest');
      link.setAttribute('href', '/site.webmanifest');
      document.head.appendChild(link);
    }
  } catch (_) {}

  // Minimal styles for the injected mobile menu search box (avoid editing every page/CSS file).
  try {
    const id = 'cpc-mobile-search-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        .mobile-nav-search { padding: 10px 14px 6px 14px; }
        .mobile-nav-search form { margin: 0; }
        .mobile-nav-search input[type="search"] {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.92);
          outline: none;
        }
        .mobile-nav-search input[type="search"]::placeholder { color: rgba(255,255,255,0.65); }
      `;
      document.head.appendChild(style);
    }
  } catch (_) {}

  function ensureNavLink(container, options) {
    const href = options.href;
    const text = options.text;
    const kind = options.kind; // 'mobile' | 'desktop'

    if (!container || !href || !text) return;

    // Already present?
    const existing = container.querySelector('a[href="' + href + '"]');
    if (existing) return;

    if (kind === 'mobile') {
      // Expected structure: <ul class="mobile-nav-links"><li><a class="mobile-menu-link" ...>...</a></li>...</ul>
      const ul =
        container.classList && container.classList.contains('mobile-nav-links')
          ? container
          : container.querySelector('.mobile-nav-links');
      if (!ul) return;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'mobile-menu-link';
      a.href = href;
      a.textContent = text;
      li.appendChild(a);
      ul.appendChild(li);
      return;
    }

    if (kind === 'desktop') {
      // Expected structure: <nav class="main-navigation"><a ...>...</a>...</nav>
      const nav =
        container.classList && container.classList.contains('main-navigation')
          ? container
          : container.querySelector('.main-navigation');
      if (!nav) return;

      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      nav.appendChild(a);
    }
  }

  function ensureMobileSearchBox(mobileNav, onSubmit) {
    if (!mobileNav) return;
    // Already present?
    if (mobileNav.querySelector('.mobile-nav-search')) return;

    const container = document.createElement('div');
    container.className = 'mobile-nav-search';

    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.autocomplete = 'off';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search…';
    input.setAttribute('aria-label', 'Search the site');

    form.appendChild(input);
    container.appendChild(form);

    // Place right below the header so it’s immediately usable.
    const header = mobileNav.querySelector('.mobile-nav-header');
    if (header && header.parentNode === mobileNav) {
      header.insertAdjacentElement('afterend', container);
    } else {
      mobileNav.insertAdjacentElement('afterbegin', container);
    }

    function submit() {
      const q = (input.value || '').toString().trim();
      if (!q) return;
      try {
        window.location.href = 'search.html?q=' + encodeURIComponent(q.slice(0, 120));
      } catch (_) {
        window.location.href = 'search.html';
      }
      if (typeof onSubmit === 'function') onSubmit();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit();
    });
  }

  function wireMobileNav(options) {
    const hamburgerButton = options.hamburgerButton;
    const mobileNav = options.mobileNav;
    const closeButton = options.closeButton;
    const overlay = options.overlay;
    const linkSelector = options.linkSelector;
    const activeClass = options.activeClass || 'active';
    const openBodyClass = options.openBodyClass || 'mobile-nav-open';

    if (!hamburgerButton || !mobileNav) return null;

    // Ensure the site-wide Search link exists in the mobile menu (without editing every HTML file).
    // Do this before we attach "close on link click" listeners so it inherits the behavior.
    ensureNavLink(mobileNav, { kind: 'mobile', href: 'search.html', text: 'Search' });

    // Basic accessibility hints (safe if attributes already exist)
    try {
      if (!hamburgerButton.hasAttribute('aria-label')) hamburgerButton.setAttribute('aria-label', 'Open menu');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      if (!hamburgerButton.hasAttribute('aria-controls') && mobileNav.id) {
        hamburgerButton.setAttribute('aria-controls', mobileNav.id);
      }
      mobileNav.setAttribute('aria-hidden', 'true');
    } catch (_) {}

    function setOpenState(isOpen) {
      hamburgerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.classList.toggle(openBodyClass, isOpen);
    }

    function open() {
      mobileNav.classList.add(activeClass);
      if (overlay) overlay.classList.add(activeClass);
      setOpenState(true);
    }

    function close() {
      mobileNav.classList.remove(activeClass);
      if (overlay) overlay.classList.remove(activeClass);
      setOpenState(false);
    }

    // Add a search box at the top of the mobile menu (routes to search.html?q=...).
    ensureMobileSearchBox(mobileNav, close);

    function toggle() {
      if (mobileNav.classList.contains(activeClass)) close();
      else open();
    }

    hamburgerButton.addEventListener('click', function (e) {
      e.preventDefault();
      toggle();
    });

    if (closeButton) {
      closeButton.addEventListener('click', function (e) {
        e.preventDefault();
        // Explicit close avoids double-toggle bugs on pages where the close target
        // accidentally overlaps with the hamburger (event bubbling).
        close();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        close();
      });
    }

    // Close when clicking a link in the menu (covers <a> lists and simple anchor stacks)
    mobileNav.querySelectorAll(linkSelector).forEach(function (link) {
      link.addEventListener('click', function () {
        close();
      });
    });

    // Close on outside click
    document.addEventListener('click', function (event) {
      const target = event.target;
      const clickedInside = mobileNav.contains(target) || hamburgerButton.contains(target);
      if (!clickedInside && mobileNav.classList.contains(activeClass)) close();
    });

    // Close on ESC
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileNav.classList.contains(activeClass)) close();
    });

    // Reset if viewport grows beyond desktop breakpoint (prevents "stuck open" state)
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 868) close();
    });

    return { open, close, toggle };
  }

  // Main site mobile nav (most pages)
  const mainHamburger = document.getElementById('hamburgerMenu');
  const mainMobileNav =
    document.getElementById('mobileNavigation') ||
    document.getElementById('mobileNav') ||
    document.querySelector('.mobile-navigation');

  // IMPORTANT: Some pages have an element with id="closeMobileMenuButton" but it's actually the
  // hamburger icon (<i class="fa-bars">) inside the hamburger button container. Treating that as
  // a "close" button causes imperfect behavior (double handlers via bubbling).
  let mainClose = document.getElementById('closeMenuButton');
  if (!mainClose && mainMobileNav) {
    mainClose = mainMobileNav.querySelector('#closeMenuButton, button[aria-label="Close menu"], .mobile-nav-header button');
  }
  const mainOverlay =
    document.getElementById('mobileNavOverlay') ||
    document.querySelector('.mobile-nav-overlay');

  // CRITICAL: Force close mobile menu on page load to prevent stuck state
  // This fixes issues where cached state or CSS keeps the menu open
  if (mainMobileNav) {
    mainMobileNav.classList.remove('active');
    document.body.classList.remove('mobile-nav-open');
    if (mainOverlay) mainOverlay.classList.remove('active');
    if (mainHamburger) {
      mainHamburger.setAttribute('aria-expanded', 'false');
    }
    if (mainMobileNav) {
      mainMobileNav.setAttribute('aria-hidden', 'true');
    }
  }

  // Also add Search to the desktop nav where present.
  ensureNavLink(document, { kind: 'desktop', href: 'search.html', text: 'Search' });

  const mainNavController = wireMobileNav({
    hamburgerButton: mainHamburger,
    mobileNav: mainMobileNav,
    closeButton: mainClose,
    overlay: mainOverlay,
    linkSelector: 'a',
    activeClass: 'active',
    openBodyClass: 'mobile-nav-open',
  });

  // Additional safety: Force close again after a brief delay to catch any race conditions
  if (mainNavController && mainNavController.close) {
    setTimeout(function() {
      mainNavController.close();
    }, 100);
  }

  // About page internal (section) mobile nav
  const aboutHamburger = document.getElementById('aboutHamburgerMenu');
  const aboutMobileNav = document.getElementById('aboutMobileNav');
  const aboutClose = document.getElementById('closeAboutMobileMenuButton');
  const aboutOverlay = document.getElementById('aboutMobileNavOverlay');

  // CRITICAL: Force close about mobile menu on page load
  if (aboutMobileNav) {
    aboutMobileNav.classList.remove('active');
    document.body.classList.remove('about-mobile-nav-open');
    if (aboutOverlay) aboutOverlay.classList.remove('active');
    if (aboutHamburger) {
      aboutHamburger.setAttribute('aria-expanded', 'false');
    }
    if (aboutMobileNav) {
      aboutMobileNav.setAttribute('aria-hidden', 'true');
    }
  }

  const aboutNavController = wireMobileNav({
    hamburgerButton: aboutHamburger,
    mobileNav: aboutMobileNav,
    closeButton: aboutClose,
    overlay: aboutOverlay,
    linkSelector: 'a',
    activeClass: 'active',
    openBodyClass: 'about-mobile-nav-open',
  });

  // Additional safety: Force close again after a brief delay
  if (aboutNavController && aboutNavController.close) {
    setTimeout(function() {
      aboutNavController.close();
    }, 100);
  }

  // Deep-link "find in page" behavior.
  // If a user lands on any page with ?find=..., scroll to the first match and highlight it.
  // This makes search results feel like real "in-page search" even when headings don't have IDs.
  try {
    const url = new URL(window.location.href);
    const find = (url.searchParams.get('find') || '').toString().trim();
    // Keep it conservative to avoid heavy DOM work for huge queries.
    if (find && find.length >= 3 && find.length <= 120) {
      const needle = find.toLowerCase();
      const ignoreClosest = 'script,style,noscript,nav,header,footer';
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            const parent = node && node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest(ignoreClosest)) return NodeFilter.FILTER_REJECT;
            const txt = (node.nodeValue || '').trim();
            if (txt.length < 6) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let matchNode = null;
      let matchIndex = -1;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const hay = (node.nodeValue || '').toLowerCase();
        const idx = hay.indexOf(needle);
        if (idx !== -1) {
          matchNode = node;
          matchIndex = idx;
          break;
        }
      }

      if (matchNode && matchNode.parentElement) {
        // Highlight by splitting the text node (safe + no external CSS required).
        const original = matchNode.nodeValue || '';
        const before = original.slice(0, matchIndex);
        const mid = original.slice(matchIndex, matchIndex + find.length);
        const after = original.slice(matchIndex + find.length);

        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));

        const mark = document.createElement('span');
        mark.textContent = mid;
        mark.setAttribute('data-find-highlight', 'true');
        mark.style.background = 'rgba(255, 232, 120, 0.65)';
        mark.style.borderRadius = '4px';
        mark.style.padding = '0 2px';
        frag.appendChild(mark);

        if (after) frag.appendChild(document.createTextNode(after));
        matchNode.parentNode.replaceChild(frag, matchNode);

        // Scroll the highlight into view.
        setTimeout(function () {
          try {
            mark.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          } catch (_) {
            mark.scrollIntoView();
          }
        }, 50);
      }
    }
  } catch (_) {}
});