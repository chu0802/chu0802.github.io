/**
 * Blog Script for Markdown Parsing and Display
 * Matches the styling of the main site
 */

document.addEventListener("DOMContentLoaded", function() {
  // Wait for marked and hljs to be available
  if (typeof marked === 'undefined' || typeof hljs === 'undefined') {
    console.error('Marked.js or Highlight.js not loaded');
    // Show error message
    const blogContent = document.getElementById('blogContent');
    if (blogContent) {
      blogContent.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Blog</h3>
          <p>Required libraries failed to load. Please refresh the page.</p>
        </div>
      `;
    }
    return;
  }

  // Configure marked.js with custom renderer
  const renderer = new marked.Renderer();
  
  // Custom code block renderer with line numbers and language label
  renderer.code = function(code, language) {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlightedCode = language && hljs.getLanguage(language) 
      ? hljs.highlight(code, { language: language }).value 
      : hljs.highlightAuto(code).value;
    
    // Split code into lines and add line numbers
    const lines = highlightedCode.split('\n');
    const numberedLines = lines.map((line, index) => {
      const lineNumber = index + 1;
      return `<span class="code-line"><span class="line-number">${lineNumber}</span><span class="line-content">${line || ' '}</span></span>`;
    }).join('\n');
    
    // Escape the original code for the copy button
    const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
    // Return code block with language label, copy button, and line numbers
    return `<div class="code-block-wrapper" data-code="${escapedCode}">
      <div class="code-block-header">
        <span class="code-language">${validLanguage}</span>
        <button class="copy-code-btn" title="Copy code">
          <i class="fas fa-copy"></i>
          <span class="copy-text">Copy</span>
        </button>
      </div>
      <pre><code class="hljs language-${validLanguage}">${numberedLines}</code></pre>
    </div>`;
  };
  
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true
  });

  // Blog state
  let blogPosts = [];
  let currentPost = null;

  // Initialize blog
  init();

  function init() {
    setupDarkMode();
    setupMobileNav();
    setupScrollTop();
    loadBlogPosts();
    setupSearchFilter();
    setupBackButton();
    updateCopyrightAndDate();
    makeVisibleSections();
  }

  /**
   * Make sections visible (for animation)
   */
  function makeVisibleSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.add('visible');
    });
  }

  /**
   * Load blog posts from the blog directory
   */
  async function loadBlogPosts() {
    console.log('Loading blog posts...');
    try {
      // Try to load blog index file if it exists
      const response = await fetch('blog/index.json');
      console.log('Fetch response:', response.status, response.ok);
      if (response.ok) {
        blogPosts = await response.json();
        console.log('Loaded blog posts:', blogPosts);
      } else {
        // If no index file, show empty state
        console.log('Blog index not found, status:', response.status);
        blogPosts = [];
      }
    } catch (error) {
      console.error('Error loading blog index:', error);
      blogPosts = [];
    }
    
    console.log('Displaying blog list with', blogPosts.length, 'posts');
    displayBlogList();
    // displayBlogSidebar();
  }

  /**
   * Display list of blog posts
   */
  function displayBlogList(filteredPosts = null) {
    const posts = filteredPosts || blogPosts;
    const blogContent = document.getElementById('blogContent');
    
    console.log('displayBlogList called with', posts.length, 'posts');
    
    if (!blogContent) {
      console.error('blogContent element not found');
      return;
    }
    
    if (posts.length === 0) {
      console.log('No posts to display, showing empty state');
      blogContent.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book-open"></i>
          <h3>No Blog Posts Yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      `;
      return;
    }

    let html = '<div class="blog-grid">';
    
    posts.forEach(post => {
      html += `
        <article class="blog-card" data-post-id="${post.id}">
          <div class="blog-card-header">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-card-image">` : ''}
            <div class="blog-card-meta">
              <time class="blog-date">${formatDate(post.date)}</time>
              ${post.tags ? `<div class="blog-tags">${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>` : ''}
            </div>
          </div>
          <div class="blog-card-content">
            <h3 class="blog-card-title">${post.title}</h3>
            <p class="blog-card-excerpt">${post.excerpt || ''}</p>
            <div class="blog-card-footer">
              <button class="read-more-btn" data-post-id="${post.id}">
                Read More <i class="fas fa-arrow-right"></i>
              </button>
              <span class="blog-read-time">
                <i class="fas fa-clock"></i> ${post.readTime || '5 min read'}
              </span>
            </div>
          </div>
        </article>
      `;
    });
    
    html += '</div>';
    blogContent.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.blog-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const postId = e.currentTarget.dataset.postId;
        loadBlogPost(postId);
      });
    });
  }

  /**
   * Display blog posts in sidebar
   */
  function displayBlogSidebar() {
    const sidebarList = document.getElementById('blog-posts-list');
    
    if (blogPosts.length === 0) {
      sidebarList.innerHTML = '<p class="empty-sidebar-text">No posts yet</p>';
      return;
    }

    let html = '';
    blogPosts.slice(0, 5).forEach(post => {
      html += `
        <div class="sidebar-blog-item" data-post-id="${post.id}">
          <h4>${post.title}</h4>
          <time>${formatDate(post.date)}</time>
        </div>
      `;
    });
    
    sidebarList.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.sidebar-blog-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const postId = e.currentTarget.dataset.postId;
        loadBlogPost(postId);
      });
    });
  }

  /**
   * Load and display a single blog post
   */
  async function loadBlogPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    try {
      const response = await fetch(post.file);
      if (!response.ok) throw new Error('Failed to load post');
      
      const markdown = await response.text();
      currentPost = post;
      displayBlogPost(post, markdown);
      
      // Show back button
      document.getElementById('backToBlogList').style.display = 'inline-flex';
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading blog post:', error);
      alert('Failed to load blog post');
    }
  }

  /**
   * Display a blog post with parsed Markdown
   */
  function displayBlogPost(post, markdown) {
    const blogContent = document.getElementById('blogContent');
    
    const html = `
      <article class="blog-post">
        <header class="blog-post-header">
          ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-post-image">` : ''}
          <h1 class="blog-post-title">${post.title}</h1>
          <div class="blog-post-meta">
            <time class="blog-date">
              <i class="fas fa-calendar"></i> ${formatDate(post.date)}
            </time>
            <span class="blog-read-time">
              <i class="fas fa-clock"></i> ${post.readTime || '5 min read'}
            </span>
            ${post.author ? `<span class="blog-author"><i class="fas fa-user"></i> ${post.author}</span>` : ''}
          </div>
          ${post.tags ? `<div class="blog-tags">${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>` : ''}
        </header>
        <div class="blog-post-content markdown-content">
          ${marked.parse(markdown)}
        </div>
      </article>
    `;
    
    blogContent.innerHTML = html;

    // Add click handlers for images (modal)
    setupImageModal();
  }

  /**
   * Setup image modal for blog post images
   */
  function setupImageModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const close = document.querySelector('.close');

    document.querySelectorAll('.markdown-content img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10); // Small delay to ensure display change is registered
        modalImg.src = img.src;
      });
    });

    const hideModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500); // Match this duration with the CSS transition duration
    };

    close.addEventListener('click', hideModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            hideModal();
        }
    });
  }

  /**
   * Setup search filter
   */
  function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      
      if (!query) {
        displayBlogList();
        return;
      }

      const filtered = blogPosts.filter(post => {
        return post.title.toLowerCase().includes(query) ||
               (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
               (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
      });

      displayBlogList(filtered);
    });
  }

  /**
   * Setup back button
   */
  function setupBackButton() {
    const backBtn = document.getElementById('backToBlogList');
    
    backBtn.addEventListener('click', () => {
      currentPost = null;
      backBtn.style.display = 'none';
      document.getElementById('searchInput').value = '';
      displayBlogList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Format date string
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Setup dark mode toggle
   */
  function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
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

  /**
   * Setup mobile navigation
   */
  function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const posts = document.querySelectorAll('.sidebar-blog-item');
    
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

  /**
   * Setup scroll to top button
   */
  function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Update copyright and last modified date
   */
  function updateCopyrightAndDate() {
    const copyrightEl = document.getElementById('copyright');
    const lastModifiedEl = document.getElementById('last-modified-date');
    
    if (copyrightEl) {
      const currentYear = new Date().getFullYear();
      copyrightEl.textContent = `© ${currentYear} Yu-Chu Yu, reserved`;
    }

    if (lastModifiedEl) {
      fetch('last_modified_date.json')
        .then(response => response.json())
        .then(data => {
          lastModifiedEl.textContent = `Last updated: ${data.lastModifiedDate}`;
        })
        .catch(() => {
          lastModifiedEl.textContent = 'Last updated: Recently';
        });
    }
  }
});
