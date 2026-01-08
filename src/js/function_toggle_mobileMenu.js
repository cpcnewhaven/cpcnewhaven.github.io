// Mobile navigation toggle - resilient across page variants
document.addEventListener('DOMContentLoaded', function () {
  function wireMobileNav(options) {
    const hamburgerButton = options.hamburgerButton;
    const mobileNav = options.mobileNav;
    const closeButton = options.closeButton;
    const overlay = options.overlay;
    const linkSelector = options.linkSelector;
    const activeClass = options.activeClass || 'active';
    const openBodyClass = options.openBodyClass || 'mobile-nav-open';

    if (!hamburgerButton || !mobileNav) return null;

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
        toggle();
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
  const mainClose =
    document.getElementById('closeMenuButton') ||
    document.getElementById('closeMobileMenuButton');
  const mainOverlay =
    document.getElementById('mobileNavOverlay') ||
    document.querySelector('.mobile-nav-overlay');

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