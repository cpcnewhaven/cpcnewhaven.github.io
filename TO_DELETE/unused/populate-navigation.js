document.addEventListener("DOMContentLoaded", function() {
  fetch('./data/navigation-links.json')
    .then(response => response.json())
    .then(data => {
      updateNavigation(data.mainNavigation, '.main-navigation');
      updateNavigation(data.mobileNavigation, '.mobile-navigation', 'mobile-menu-link');
    })
    .catch(error => console.error('Error fetching navigation links:', error));
});

function updateNavigation(links, navSelector, linkClass = '') {
  const navElement = document.querySelector(navSelector);
  navElement.innerHTML = ''; // Clear existing links

  links.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.text;
    if (linkClass) {
      anchor.classList.add(linkClass);
    }
    navElement.appendChild(anchor);
  });
}