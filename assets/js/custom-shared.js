/**
 * Custom script to display files from files_info.json
 * Matches the styling of the main site
 */
document.addEventListener("DOMContentLoaded", function() {
  // Current path tracking (for directory navigation)
  let currentPath = [];
  let fileData = null;

  // Function to format file size
  function formatBytes(bytes, decimals = 0) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
  }

  // Function to get file icon based on file type
  function getFileIcon(fileType) {
    const iconMap = {
      "pdf": "fa-file-pdf",
      "doc": "fa-file-word", "docx": "fa-file-word",
      "xls": "fa-file-excel", "xlsx": "fa-file-excel",
      "ppt": "fa-file-powerpoint", "pptx": "fa-file-powerpoint",
      "txt": "fa-file-lines",
      "zip": "fa-file-zipper", "rar": "fa-file-zipper", "gz": "fa-file-zipper",
      "png": "fa-file-image", "jpg": "fa-file-image", "jpeg": "fa-file-image", "gif": "fa-file-image",
      "mp4": "fa-file-video", "avi": "fa-file-video", "mov": "fa-file-video",
      "mp3": "fa-file-audio", "wav": "fa-file-audio",
      "js": "fa-file-code", "html": "fa-file-code", "css": "fa-file-code", "py": "fa-file-code"
    };

    return iconMap[fileType?.toLowerCase()] || "fa-file";
  }

  // Function to navigate to a directory
  function navigateToDirectory(dirPath) {
    if (!fileData) return;
    
    // Navigate to requested directory
    let currentDir = fileData;
    
    // If we have a path, navigate to it
    if (dirPath.length > 0) {
      for (const part of dirPath) {
        if (currentDir[part] && currentDir[part].files) {
          currentDir = currentDir[part].files;
        } else {
          console.error('Directory not found:', dirPath);
          return;
        }
      }
    }
    
    displayFiles(currentDir, dirPath);
  }
  
  // Function to go up one directory
  function goUpDirectory() {
    if (currentPath.length > 0) {
      currentPath.pop();
      navigateToDirectory(currentPath);
    }
  }

  // Function to display directory path
  function displayDirectoryPath() {
    const pathContainer = document.getElementById('current-path');
    
    if (!pathContainer) return;
    
    // Clear existing content
    pathContainer.innerHTML = '';
    
    // Create home link
    const homeLink = document.createElement('a');
    homeLink.href = '#';
    homeLink.innerHTML = '<i class="fas fa-folder-open"></i> Root';
    homeLink.addEventListener('click', function(e) {
      e.preventDefault();
      currentPath = [];
      navigateToDirectory([]);
    });
    
    pathContainer.appendChild(homeLink);
    
    // Create path links
    let pathSoFar = [];
    currentPath.forEach((part, index) => {
      // Add separator
      const separator = document.createElement('span');
      separator.textContent = ' / ';
      pathContainer.appendChild(separator);
      
      // Add path part link
      pathSoFar.push(part);
      const pathLink = document.createElement('a');
      pathLink.href = '#';
      pathLink.textContent = part;
      
      // Clone the path to avoid reference issues
      const targetPath = [...pathSoFar];
      pathLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPath = targetPath;
        navigateToDirectory(currentPath);
      });
      
      pathContainer.appendChild(pathLink);
    });
  }
  
  // Function to display files from a directory
  function displayFiles(directory, path) {
    currentPath = path || [];
    const filesContainer = document.getElementById('files');
    
    if (!filesContainer) return;
    
    // Display current path
    displayDirectoryPath();
    
    // Clear existing files
    filesContainer.innerHTML = '';
    
    // Convert directory object to array for easier handling
    const filesList = Object.entries(directory).map(([key, value]) => ({...value, key}));
    
    if (filesList.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'error-message';
      emptyMessage.textContent = 'This directory is empty';
      filesContainer.appendChild(emptyMessage);
      return;
    }
    
    // Sort: directories first, then by date
    filesList.sort((a, b) => {
      // Handle parent directory (..)
      if (a.key === "..") return -1;
      if (b.key === "..") return 1;
      
      // Handle directories
      if (a.size === "Directory" && b.size !== "Directory") return -1;
      if (a.size !== "Directory" && b.size === "Directory") return 1;
      
      // Sort by date
      return new Date(b.last_modified) - new Date(a.last_modified);
    });
    
    // Add "go up" item if we're in a subdirectory
    if (currentPath.length > 0) {
      const backItem = document.createElement('div');
      backItem.className = 'file-item file-item-back';
      
      const iconElement = document.createElement('div');
      iconElement.className = 'file-icon';
      iconElement.innerHTML = '<i class="fas fa-arrow-up"></i>';
      
      const infoElement = document.createElement('div');
      infoElement.className = 'file-info';
      
      const nameElement = document.createElement('div');
      nameElement.className = 'file-name';
      nameElement.textContent = 'Parent Directory';
      
      const backButton = document.createElement('a');
      backButton.href = '#';
      backButton.className = 'file-download file-view-link';
      backButton.textContent = 'Go Back';
      backButton.addEventListener('click', function(e) {
        e.preventDefault();
        goUpDirectory();
      });
      
      infoElement.appendChild(nameElement);
      infoElement.appendChild(backButton);
      
      backItem.appendChild(iconElement);
      backItem.appendChild(infoElement);
      
      filesContainer.appendChild(backItem);
    }
    
    // Create and append file items
    filesList.forEach(file => {
      // Skip the parent directory item since we already handled it
      if (file.key === "..") return;
      
      const fileItem = createFileItem(file);
      filesContainer.appendChild(fileItem);
    });
  }

  // Function to generate a file item element
  function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    // Create icon element
    const iconElement = document.createElement('div');
    iconElement.className = 'file-icon';
    
    // Check if it's a directory
    if (file.size === "Directory") {
      // Display folder icon
      iconElement.innerHTML = `<i class="fas fa-folder"></i>`;
      
      // Create info container
      const infoElement = document.createElement('div');
      infoElement.className = 'file-info';
      
      // Create file name element
      const nameElement = document.createElement('div');
      nameElement.className = 'file-name';
      nameElement.textContent = file.name;
      
      // Create file meta element
      const metaElement = document.createElement('div');
      metaElement.className = 'file-meta';
      metaElement.innerHTML = `
        <span>Directory</span>
        <span>${file.last_modified}</span>
      `;
      
      // Create view link
      const viewLink = document.createElement('a');
      viewLink.href = '#';
      viewLink.className = 'file-download file-view-link';
      viewLink.textContent = 'View Contents';
      
      // Add click handler to navigate into this directory
      viewLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPath.push(file.key);
        navigateToDirectory(currentPath);
      });
      
      // Append elements
      infoElement.appendChild(nameElement);
      infoElement.appendChild(metaElement);
      infoElement.appendChild(viewLink);
      
      fileItem.appendChild(iconElement);
      fileItem.appendChild(infoElement);
      
      return fileItem;
    }
    
    // Handle file (non-directory)
    if (file.type && (file.type.toLowerCase() === 'png' || file.type.toLowerCase() === 'jpg' || file.type.toLowerCase() === 'jpeg')) {
      // If it's an image, display the image
      iconElement.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
    } else {
      // Otherwise display appropriate icon
      const iconClass = getFileIcon(file.type);
      iconElement.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }
    
    // Create info container
    const infoElement = document.createElement('div');
    infoElement.className = 'file-info';
    
    // Create file name element
    const nameElement = document.createElement('div');
    nameElement.className = 'file-name';
    nameElement.textContent = file.name;
    
    // Create file meta element
    const metaElement = document.createElement('div');
    metaElement.className = 'file-meta';
    metaElement.innerHTML = `
      <span>${typeof file.size === 'number' ? formatBytes(file.size) : file.size}</span>
      <span>${file.last_modified}</span>
    `;
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = file.url;
    downloadLink.className = 'file-download file-view-link';
    downloadLink.target = '_blank';
    downloadLink.download = file.name;
    downloadLink.textContent = 'Download';
    
    // Append elements
    infoElement.appendChild(nameElement);
    infoElement.appendChild(metaElement);
    infoElement.appendChild(downloadLink);
    
    fileItem.appendChild(iconElement);
    fileItem.appendChild(infoElement);
    
    return fileItem;
  }

  // Load and render files
  fetch('files_info.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load files');
      }
      return response.json();
    })
    .then(data => {
      fileData = data;
      navigateToDirectory([]);
    })
    .catch(error => {
      console.error('Error loading files:', error);
      const filesContainer = document.getElementById('files');
      if (filesContainer) {
        filesContainer.innerHTML = `<p class="error-message">Failed to load files: ${error.message}</p>`;
      }
    });
}); 