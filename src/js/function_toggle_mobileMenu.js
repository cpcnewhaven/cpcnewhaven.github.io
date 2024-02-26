      document.getElementById('hamburgerMenu').addEventListener('click', function() {
        document.getElementById('mobileNavigation').classList.toggle('active');
      });
  
      // Close menu when the exit button is clicked
      document.getElementById('closeMenuButton').addEventListener('click', function() {
        document.getElementById('mobileNavigation').classList.remove('active');
      });
  
      // Close the menu when clicking outside of it
      document.addEventListener('click', function(event) {
        var isClickInsideMenu = document.getElementById('mobileNavigation').contains(event.target);
        var isMenuActive = document.getElementById('mobileNavigation').classList.contains('active');
        var isHamburgerMenuClick = document.getElementById('hamburgerMenu').contains(event.target);
  
        if (!isClickInsideMenu && isMenuActive && !isHamburgerMenuClick) {
          document.getElementById('mobileNavigation').classList.remove('active');
        }
      });