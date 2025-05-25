// File: js/script.js

const ASSET_PATH = 'assets/resume/';

/**
 * Render the Introduction section from JSON.
 * Expects each item in `list` to have:
 *   - introduction (HTML string)
 */
function renderIntroduction(list) {
  const container = document.getElementById('introduction');
  container.innerHTML = '';
  list.forEach(i => {
    const item = document.createElement('div');
    item.className = 'introduction-item';
    item.innerHTML = i.introduction;
    container.appendChild(item);
  });
}

/**
 * Render the Publication section from JSON.
 * Expects each item in `list` to have:
 *   - title, author (HTML string), conference, year,
 *   - optional arxivLink, githubLink, image
 */
function renderPublications(list) {
  const container = document.getElementById('publication-list');
  container.innerHTML = '';
  list.forEach(p => {
    const item = document.createElement('div');
    item.className = 'pub-item';
    
    // Default image or abbr-based fallback
    const imgSrc = p.image || `assets/img/publications/${p.abbr || 'placeholder'}.jpg`;
    
    // Process authors with links
    const authors = p.author.split(', ').map((author, index) => {
      // Make Yu-Chu Yu bold
      const isAuthor = author === "Yu-Chu Yu";
      const authorText = isAuthor ? `<strong>${author}</strong>` : author;
      
      if (p.links && p.links[index]) {
        if (isAuthor)
          return `<span class="author-link">${authorText}</span>`;
        else
          return `<a href="${p.links[index]}" target="_blank" class="author-link">${authorText}</a>`;
      }
      return `<span>${authorText}</span>`;
    }).join(', ');
    
    item.innerHTML = `
      <div class="pub-img">
        <img src="${imgSrc}" alt="${p.title}" onerror="this.src='assets/img/placeholder-pub.jpg'; this.onerror=null;">
      </div>
      <div class="pub-details">
        <h3>${p.title}</h3>
        <div class="authors" style="word-spacing:normal;">${authors}</div>
        <div class="venue">${p.conference}${p.confAbbr ? ` (<strong>${p.confAbbr}</strong>)` : ''}, ${p.year}</div>
        <div class="links">
          ${p.arxivLink ? `<a href="${p.arxivLink}" target="_blank"><i class="fas fa-file-pdf"></i> Paper Link</a>` : ''}
          ${p.githubLink ? `<a href="${p.githubLink}" target="_blank"><i class="fab fa-github"></i> Project Page</a>` : ''}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

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
        ${it.institution}
        ${it.location ? `<span class="location">${it.location}</span>` : ''}
        ${it.advisor ? `<span class="advisor">${it.advisor}</span>` : ''}
      </div>
      <div class="date-pill">${it.start} ${it.end ? `– ${it.end}` : ''}</div>
      ${it.role ? `<div class="role">${it.role}</div>` : ''}
      ${Array.isArray(it.description) && it.description.length
        ? `<ul>${it.description.map(d => `<li>${d}</li>`).join('')}</ul>`
        : ''}
    `;
    container.appendChild(div);
  });
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

  // 4. Intersection Observer for section reveal & active nav-link
  // Enhanced with smooth section animations
  if (sections.length > 0 && navLinks.length > 0) {
    const isMobile = window.innerWidth <= 768;
    
    // More responsive thresholds to show sections earlier
    // Lower threshold means sections become visible when just a small portion is in view
    const observerThreshold = 0.05; // Reduced to show sections much earlier
    
    // Larger negative margin means elements are considered "in view" even before they appear
    const observerMargin = "0px 0px -20% 0px"; // Adjusted to trigger earlier
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class for animation immediately
          entry.target.classList.add('visible');
          
          // Update active nav link
          navLinks.forEach(a => {
            const href = a.getAttribute('href') || '';
            if (href === `#${entry.target.id}`) {
              a.classList.add('active');
            } else if (href !== `#${entry.target.id}`) {
              a.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: observerThreshold, rootMargin: observerMargin });
    
    sections.forEach(sec => observer.observe(sec));
    
    // Set initial active link on load
    let initialActiveSet = false;
    const currentHash = window.location.hash;
    if (currentHash) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
          link.classList.add('active');
          initialActiveSet = true;
          
          // Scroll to the section after a short delay
          setTimeout(() => {
            document.querySelector(currentHash).scrollIntoView({
              behavior: 'smooth'
            });
          }, 300);
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // If no hash or hash not matching, try to set based on scroll
    if (!initialActiveSet) {
      const firstSection = sections[0];
      if (firstSection && window.scrollY < firstSection.offsetTop + firstSection.clientHeight * 0.5) {
        navLinks.forEach(l => l.classList.remove('active'));
        const homeLink = document.querySelector('.nav-links a[href="#about"]') || navLinks[0];
        if (homeLink) {
          homeLink.classList.add('active');
        }
      }
    }
    
    // Make first section visible immediately
    if (sections[0]) {
      setTimeout(() => {
        sections[0].classList.add('visible');
      }, 100);
    }
  }

  // 5. Smooth scrolling for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Only prevent default and handle smooth scroll for same-page links
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 50,
            behavior: 'smooth'
          });
        }
      }
      // External links (like newresources.html) will work normally
    });
  });

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

  // 8. Add staggered animations to elements
  // Animate paragraphs with staggered delay
  const paragraphs = document.querySelectorAll('.about-info p');
  paragraphs.forEach((p, index) => {
    p.style.setProperty('--item-index', index);
  });
  
  // 9. Add visible class to all sections initially in viewport
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add('visible');
    }
  });
  
  // 10. Add resize handler for sidebar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      const icon = navToggle.querySelector('i');
      if (icon && icon.classList.contains('fa-times')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });
});


