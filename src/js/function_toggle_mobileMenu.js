      // Add a transition effect for smoother opening and closing
      const mobileNav = document.getElementById('mobileNavigation');
      mobileNav.style.transition = 'transform 0.3s ease-in-out';
      mobileNav.style.transform = 'translateX(100%)'; // Start off-screen

      document.getElementById('hamburgerMenu').addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        mobileNav.style.transform = mobileNav.classList.contains('active') ? 'translateX(0)' : 'translateX(100%)'; // Slide in/out
      });
  
      // Close menu when the exit button is clicked
      document.getElementById('closeMenuButton').addEventListener('click', function() {
        mobileNav.classList.remove('active');
        mobileNav.style.transform = 'translateX(100%)'; // Slide out
      });
  
      // Close the menu when clicking outside of it
      document.addEventListener('click', function(event) {
        var isClickInsideMenu = mobileNav.contains(event.target);
        var isMenuActive = mobileNav.classList.contains('active');
        var isHamburgerMenuClick = document.getElementById('hamburgerMenu').contains(event.target);
  
        if (!isClickInsideMenu && isMenuActive && !isHamburgerMenuClick) {
          mobileNav.classList.remove('active');
          mobileNav.style.transform = 'translateX(100%)'; // Slide out
        }
      });

      document.addEventListener('DOMContentLoaded', function() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileNavigation = document.getElementById('mobileNavigation');
        const closeMenuButton = document.getElementById('closeMenuButton');

        function toggleMobileMenu() {
            mobileNavigation.style.display = mobileNavigation.style.display === 'block' ? 'none' : 'block';
        }

        hamburgerMenu.addEventListener('click', toggleMobileMenu);
        closeMenuButton.addEventListener('click', toggleMobileMenu);
      });