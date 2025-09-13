const ASSET_PATH = 'assets/resume/';


/**
 * Convert education and experience JSON format to timeline format
 */
function mapEducationToTimeline(data) {
    return data.map(item => {
      let start = '';
      let end = '';
      
      // Parse different date formats
      if (item.year) {
        if (item.year.includes('-') || item.year.includes(' - ')) {
          const separator = item.year.includes(' - ') ? ' - ' : '-';
          const parts = item.year.split(separator);
          start = parts[0];
          end = parts.length > 1 ? parts[1] : 'Present';
        } else {
          start = item.year;
          end = null;
        }
      }
      
      // Handle descriptions - could be array, object, or null
      let descriptions = [];
      if (Array.isArray(item.description)) {
        descriptions = item.description;
      } else if (item.description && typeof item.description === 'object') {
        descriptions = Object.entries(item.description).map(([key, value]) => `${key}: ${value}`);
      }
      
      return {
        institution: item.title || '',
        overview: item.overview || '',
        location: item.location || '',
        advisor: item.advisor || '',
        start: start,
        end: end,
        role: item.role || '',
        description: descriptions
      };
    });
  }
  
  /**
   * Generic timeline renderer.
   * containerId: ID of the .timeline container
   * items: array of objects with fields:
   *   - institution (string), location (optional string),
   *   - start (string), end (string or null),
   *   - role (optional string), description (optional array of strings)
   */
  function renderTimeline(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return;
    }
    
    container.innerHTML = '';
    
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'timeline-item';
      
      // Add a class for ongoing/present positions
      if (it.end === 'Present' || it.end === 'present') {
        div.classList.add('timeline-item-present');
      }
      
      div.innerHTML = `
        <div class="institution">
          ${it.institution? it.institution : it.overview}
          ${it.location ? `<span class="location">${it.location}</span>` : ''}
          ${it.advisor ? `<span class="advisor">${it.advisor}</span>` : ''}
        </div>
        ${it.start ? `<div class="date-pill">${it.start} ${it.end ? `– ${it.end}` : ''}</div>` : ''}
        ${it.role ? `<div class="role">${it.role}</div>` : ''}
        ${Array.isArray(it.description) && it.description.length
          ? `<ul>${it.description.map(d => `<li>${d}</li>`).join('')}</ul>`
          : ''}
      `;
      container.appendChild(div);
    });
  }
  
  function renderLastModifiedDate(data) {
    const lastModifiedDate = document.getElementById('last-modified-date');
    lastModifiedDate.textContent = "Last updated: " + data.lastModifiedDate;
  }
  
  function renderCopyright(data) {
    const copyright = document.getElementById('copyright');
    const currentYear = data.lastModifiedDate.split('/')[0];
    copyright.textContent = `© ${currentYear} Yu-Chu Yu, reserved`;
  }


  document.addEventListener('DOMContentLoaded', () => {
    // Selectors (defined once)
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const scrollTopButton = document.getElementById('scroll-top');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.querySelector('.sidebar');
    
    console.log('Loading resume data from:', ASSET_PATH);
  
    // -1. Load last modified date
    fetch('last_modified_date.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load last modified date: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        renderCopyright(data);
        renderLastModifiedDate(data);
      })
    
    // -0.5 Load contact list
    fetch(ASSET_PATH + 'contact-list.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load contact list: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => renderContactList(data))
  
    // 0. Load and render Introduction
    fetch(ASSET_PATH + 'introduction.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load introduction: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => renderIntroduction(data))
      .catch(err => {
        console.error('Failed to load introduction:', err);
        document.getElementById('introduction').innerHTML = `<p class="error-message">Failed to load introduction data. Error: ${err.message}</p>`;
      });
  
    // 0.5. Load and render News
    fetch(ASSET_PATH + 'news.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load news: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => renderNews(data))
      .catch(err => {
        console.error('Failed to load news:', err);
        document.getElementById('news-list').innerHTML = `<p class="error-message">Failed to load news data. Error: ${err.message}</p>`;
      });
  
    // 1. Load and render Publications
    fetch(ASSET_PATH + 'publication.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load publications: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => renderPublications(data))
      .catch(err => {
        console.error('Failed to load publications:', err);
        document.getElementById('publication-list').innerHTML = `<p class="error-message">Failed to load publication data. Error: ${err.message}</p>`;
      });
  
    // 2. Load and render Resume timelines with better error handling
    const loadTimelineData = (filename, containerId, mapFn = mapEducationToTimeline) => {
      fetch(ASSET_PATH + filename)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => renderTimeline(containerId, mapFn(data)))
        .catch(err => {
          console.error(`Failed to load ${filename}:`, err);
          const container = document.getElementById(containerId);
          if (container) {
            container.innerHTML = `<p class="error-message">Failed to load data. Error: ${err.message}</p>`;
          }
        });
    };
  
    loadTimelineData('education.json', 'education-timeline');
    loadTimelineData('teaching.json', 'teaching-timeline');
    loadTimelineData('research-experience.json', 'research-timeline');
    loadTimelineData('work-experience.json', 'work-timeline');
    loadTimelineData('service.json', 'service-timeline');
  
    // 3. Mobile sidebar toggle
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
            
            // Make sure the section being navigated to is visible
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
              const targetSection = document.querySelector(href);
              if (targetSection) {
                // Make all sections visible in mobile to ensure content is displayed
                sections.forEach(section => {
                  section.classList.add('visible');
                });
                
                // Scroll to the target section with a slight delay to allow for UI updates
                setTimeout(() => {
                  window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                  });
                }, 100);
              }
            }
          }
        });
      });
    }

    if (sections.length > 0) {
        sections.forEach(section => section.classList.add('visible'));
    }

    // 6. Scroll-to-top button
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
        });
        
        scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 7. Dark Mode Toggle
    if (darkModeToggle) {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
        });
    }

});