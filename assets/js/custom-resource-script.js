function renderLastModifiedDate(data) {
  const lastModifiedDate = document.getElementById('last-modified-date');
  lastModifiedDate.textContent = "Last updated: " + data.lastModifiedDate;
}

function renderCopyright(data) {
  const copyright = document.getElementById('copyright');
  const currentYear = data.lastModifiedDate.split('/')[0];
  copyright.textContent = `© ${currentYear} Yu-Chu Yu, reserved`;
}


// Simplified script for newresources.html that preserves active class
document.addEventListener('DOMContentLoaded', () => {
  // Selectors
  const scrollTopButton = document.getElementById('scroll-top');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const navToggle = document.getElementById('navToggle');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.nav-links a');

  // -1. Load last modified date
  fetch('last_modified_date.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load last modified date: ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      renderLastModifiedDate(data);
      renderCopyright(data);
    })

  // 1. Dark Mode Toggle
  if (darkModeToggle) {
    // Check local storage for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if previously set
    if (isDarkMode) {
      body.classList.add('dark-mode');
      body.classList.add('resources-page');
    }
    
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      body.classList.add('resources-page');
      // Store preference
      localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
  }
  
  // 2. Mobile sidebar toggle
  if (navToggle && sidebar) {
    navToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      // Toggle the hamburger icon with animation
      const icon = navToggle.querySelector('i');
      
      // Create a new icon element to replace the old one
      const newIcon = document.createElement('i');
      
      if (icon.classList.contains('fa-bars')) {
        // Switching to X (close)
        newIcon.className = 'fas fa-times';
        
        // Remove the old icon and add the new one
        icon.remove();
        navToggle.appendChild(newIcon);
      } else {
        // Switching to bars (menu)
        newIcon.className = 'fas fa-bars';
        
        // Remove the old icon and add the new one
        icon.remove();
        navToggle.appendChild(newIcon);
      }
    });
    
    // Close sidebar when a menu item is clicked on mobile
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          
          // Ensure we show the menu icon when sidebar closes
          const icon = navToggle.querySelector('i');
          if (!icon.classList.contains('fa-bars')) {
            const newIcon = document.createElement('i');
            newIcon.className = 'fas fa-bars';
            icon.remove();
            navToggle.appendChild(newIcon);
          }
        }
      });
    });
  }
  
  // 3. Scroll to Top Button
  if (scrollTopButton) {
    // Make the button visible initially on resources page
    scrollTopButton.classList.add('visible');
    
    // Still add scroll listener for better user experience
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopButton.classList.add('visible');
      } else if (window.pageYOffset <= 100) {
        // Hide only when near the top for resources page
        scrollTopButton.classList.remove('visible');
      }
    });
    
    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // 4. Make resource section visible (animation)
  const sections = document.querySelectorAll('.section');
  if (sections.length > 0) {
    sections.forEach(section => section.classList.add('visible'));
  }
}); 