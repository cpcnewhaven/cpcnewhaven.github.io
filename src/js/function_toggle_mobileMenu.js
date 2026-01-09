// Mobile navigation toggle - resilient across page variants
document.addEventListener('DOMContentLoaded', function () {
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

  // Also add Search to the desktop nav where present.
  ensureNavLink(document, { kind: 'desktop', href: 'search.html', text: 'Search' });

  wireMobileNav({
    hamburgerButton: mainHamburger,
    mobileNav: mainMobileNav,
    closeButton: mainClose,
    overlay: mainOverlay,
    linkSelector: 'a',
    activeClass: 'active',
    openBodyClass: 'mobile-nav-open',
  });

  // About page internal (section) mobile nav
  const aboutHamburger = document.getElementById('aboutHamburgerMenu');
  const aboutMobileNav = document.getElementById('aboutMobileNav');
  const aboutClose = document.getElementById('closeAboutMobileMenuButton');
  const aboutOverlay = document.getElementById('aboutMobileNavOverlay');

  wireMobileNav({
    hamburgerButton: aboutHamburger,
    mobileNav: aboutMobileNav,
    closeButton: aboutClose,
    overlay: aboutOverlay,
    linkSelector: 'a',
    activeClass: 'active',
    openBodyClass: 'about-mobile-nav-open',
  });
});