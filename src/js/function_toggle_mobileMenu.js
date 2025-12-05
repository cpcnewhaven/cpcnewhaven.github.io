// Mobile navigation toggle - resilient across page variants
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerButton = document.getElementById('hamburgerMenu');
  // Support both legacy and current IDs/classes
  const mobileNav =
    document.getElementById('mobileNav') ||
    document.getElementById('mobileNavigation') ||
    document.querySelector('.mobile-navigation');
  const closeButton =
    document.getElementById('closeMobileMenuButton') ||
    document.getElementById('closeMenuButton');
  const overlay =
    document.getElementById('mobileNavOverlay') ||
    document.querySelector('.mobile-nav-overlay');

  if (!hamburgerButton || !mobileNav) {
    return; // Nothing to wire up on this page
  }

  // Initialize transition state if not already set
  try {
    mobileNav.style.transition = mobileNav.style.transition || 'transform 0.3s ease-in-out';
    // Only apply transform-based sliding if element is off-canvas
    if (!mobileNav.classList.contains('active')) {
      mobileNav.style.transform = 'translateX(100%)';
    }
  } catch (_) {}

  function openMobileNav() {
    mobileNav.classList.add('active');
    try {
      mobileNav.style.transform = 'translateX(0)';
    } catch (_) {}
  }

  function closeMobileNav() {
    mobileNav.classList.remove('active');
    try {
      mobileNav.style.transform = 'translateX(100%)';
    } catch (_) {}
  }

  function toggleMobileNav() {
    if (mobileNav.classList.contains('active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  hamburgerButton.addEventListener('click', toggleMobileNav);
  if (closeButton) {
    closeButton.addEventListener('click', toggleMobileNav);
  }
  if (overlay) {
    overlay.addEventListener('click', closeMobileNav);
  }

  // Close on outside click
  document.addEventListener('click', function (event) {
    const clickedInside = mobileNav.contains(event.target) || hamburgerButton.contains(event.target);
    if (!clickedInside && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });
});