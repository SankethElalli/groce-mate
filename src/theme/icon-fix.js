// This script fixes SVG icon coloring issues with dark mode
// It runs after the DOM is loaded to ensure icons are properly styled

document.addEventListener('DOMContentLoaded', function() {
  // Apply theme class for better dark mode detection
  document.body.classList.add('ionic-theme-detector');

  // Force load ionicons if needed
  if (typeof window.Ionicons === 'undefined') {
    console.log('Ensuring Ionicons are loaded');
    const ioniconsLink = document.createElement('link');
    ioniconsLink.rel = 'stylesheet';
    ioniconsLink.href = 'https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/css/ionicons.min.css';
    document.head.appendChild(ioniconsLink);
  }

  // Function to fix tab bar icons
  function fixTabBarIcons() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const tabButtons = document.querySelectorAll('ion-tab-button');
    
    tabButtons.forEach(button => {
      const icon = button.querySelector('ion-icon');
      if (icon) {
        const isSelected = button.classList.contains('tab-selected');
        
        // Get the correct color based on theme and selection state
        let color;
        if (isDarkMode) {
          color = isSelected ? '#66bb6a' : '#8c8c8c';
        } else {
          color = isSelected ? '#4caf50' : '#888888';
        }
        
        // Apply color to SVG if it exists
        const svg = icon.querySelector('svg');
        if (svg) {
          // Set stroke color for SVG paths
          const paths = svg.querySelectorAll('path');
          paths.forEach(path => {
            path.setAttribute('stroke', color);
          });
          
          // Force repaint
          svg.style.stroke = color;
        }
        
        // Set color on the icon itself
        icon.style.color = color;
        icon.style.setProperty('--ionicon-stroke-color', color);
      }
    });
  }

  // Initial fix
  fixTabBarIcons();
  
  // Apply fix again after a delay to ensure icons are loaded
  setTimeout(fixTabBarIcons, 100);
  setTimeout(fixTabBarIcons, 500);
  setTimeout(fixTabBarIcons, 1000);
  
  // Watch for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fixTabBarIcons);
  
  // Watch for tab changes that might affect selected state
  const tabBar = document.querySelector('ion-tab-bar');
  if (tabBar) {
    const observer = new MutationObserver(fixTabBarIcons);
    observer.observe(tabBar, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
  
  // Make sure icons are visible by directly manipulating tab buttons
  const tabButtons = document.querySelectorAll('ion-tab-button');
  tabButtons.forEach(button => {
    // Force icon to be visible
    const icon = button.querySelector('ion-icon');
    if (icon) {
      icon.style.visibility = 'visible';
      icon.style.opacity = '1';
      icon.style.display = 'block';
      icon.style.fontSize = '24px';
      
      // Try to manually insert icon content if needed
      const tab = button.getAttribute('tab');
      if (tab === 'home' && !icon.innerHTML) {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212" stroke-linecap="round" stroke-linejoin="round" class="ionicon-fill-none ionicon-stroke-width"/><path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" stroke-linecap="round" stroke-linejoin="round" class="ionicon-fill-none ionicon-stroke-width"/></svg>';
      } else if (tab === 'menu' && !icon.innerHTML) {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path stroke-linecap="round" stroke-linejoin="round" d="M448 448V240M64 240v208M382.47 48H129.53c-21.79 0-41.47 12-49.93 30.46L36.3 173c-14.58 31.81 9.63 67.85 47.19 69h2c31.4 0 56.85-25.18 56.85-52.23 0 27 25.46 52.23 56.86 52.23s56.8-23.38 56.8-52.23c0 27 25.45 52.23 56.85 52.23s56.86-23.38 56.86-52.23c0 28.85 25.45 52.23 56.85 52.23h1.95c37.56-1.17 61.77-37.21 47.19-69l-43.3-94.54C423.94 60 404.26 48 382.47 48zM32 464h448M136 288h80a24 24 0 0124 24v88h0-128 0v-88a24 24 0 0124-24zM288 464V312a24 24 0 0124-24h64a24 24 0 0124 24v152" class="ionicon-fill-none ionicon-stroke-width"/></svg>';
      } else if (tab === 'cart' && !icon.innerHTML) {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><circle cx="176" cy="416" r="16" stroke-linecap="round" stroke-linejoin="round" class="ionicon-fill-none ionicon-stroke-width"/><circle cx="400" cy="416" r="16" stroke-linecap="round" stroke-linejoin="round" class="ionicon-fill-none ionicon-stroke-width"/><path stroke-linecap="round" stroke-linejoin="round" d="M48 80h64l48 272h256" class="ionicon-fill-none ionicon-stroke-width"/><path d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128" stroke-linecap="round" stroke-linejoin="round" class="ionicon-fill-none ionicon-stroke-width"/></svg>';
      }
    }
  });
});
