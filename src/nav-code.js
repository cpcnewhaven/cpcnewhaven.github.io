document.addEventListener('DOMContentLoaded', function () {
  // This script is used by some legacy pages. Keep it defensive so it never
  // breaks pages that don't have the expected elements.
  var header = document.getElementById('myHeader');
  var page = document.getElementById('page');
  var openMenuButton = document.getElementById('openmenu');

  if (header && page) {
    window.addEventListener('scroll', function () {
      page.classList.remove('menuopen');
      if (window.scrollY >= 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Event listener to remove the sticky class when the button is clicked
  if (openMenuButton && header && page) {
    openMenuButton.addEventListener('click', function () {
      header.classList.remove('sticky');
      page.classList.add('menuopen');
    });
  }

  // Smooth-scroll for in-page anchors (safe everywhere)
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      // Prevent the default action
      event.preventDefault();

      // Get the target element
      var targetId = this.getAttribute('href');
      var targetElement = targetId ? document.querySelector(targetId) : null;

      // Smooth scroll to target
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  });
});
