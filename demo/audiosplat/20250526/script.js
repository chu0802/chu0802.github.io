const ITEMS_PER_PAGE = 50;
const ITEMS_PER_ROW = 4;

let methodsData = {};
let currentPage = 0;

async function fetchData() {
  // Load methods.json
  const methodsRes = await fetch('methods.json');
  methodsData = await methodsRes.json();

  renderPagination();
  renderPage(0);
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const objectTypes = Object.keys(methodsData);
  const totalPages = Math.ceil(objectTypes.length / ITEMS_PER_PAGE);

  pagination.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Page ${i + 1}`;
    btn.style.display = 'block';
    btn.style.marginBottom = '10px';
    btn.onclick = () => renderPage(i);
    pagination.appendChild(btn);
  }
}

function renderPage(page) {
  currentPage = page;
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  const objectTypes = Object.keys(methodsData).slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  objectTypes.forEach((objectType, index) => {
    const container = document.createElement('div');
    container.classList.add('row-container');

    const descEl = document.createElement('div');
    descEl.classList.add('row-description');
    descEl.textContent = `${objectType.replace(/_/g, ' ').toUpperCase()} - Audio Methods Comparison`;
    container.appendChild(descEl);

    const objectData = methodsData[objectType];
    
    objectData.forEach((methodSet, setIndex) => {
      const methodContainer = document.createElement('div');
      methodContainer.classList.add('method-set');
      methodContainer.style.marginBottom = '30px';
      methodContainer.style.border = '1px solid #ddd';
      methodContainer.style.padding = '20px';
      methodContainer.style.borderRadius = '8px';

      const setTitle = document.createElement('h3');
      setTitle.textContent = `${objectType} - Set ${setIndex + 1}`;
      setTitle.style.marginBottom = '15px';
      setTitle.style.color = '#333';
      methodContainer.appendChild(setTitle);

      const methodsRow = document.createElement('div');
      methodsRow.style.display = 'grid';
      methodsRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
      methodsRow.style.gap = '15px';

      // Create audio blocks for each method
      Object.entries(methodSet).forEach(([methodName, audio]) => {
        const audioPath = audio.path;
        const audioPrompt = audio.prompt;
        const audioBlock = document.createElement('div');
        audioBlock.classList.add('audio-block');
        audioBlock.style.border = '1px solid #eee';
        audioBlock.style.padding = '15px';
        audioBlock.style.borderRadius = '5px';
        audioBlock.style.backgroundColor = '#f9f9f9';
        audioBlock.style.minWidth = '0'; // Allow content to shrink

        const methodTitle = document.createElement('div');
        methodTitle.style.fontWeight = 'bold';
        methodTitle.style.marginBottom = '10px';
        methodTitle.style.color = '#555';
        methodTitle.style.textTransform = 'capitalize';
        methodTitle.textContent = methodName.replace(/_/g, ' ');
        audioBlock.appendChild(methodTitle);

        const audioEl = document.createElement('audio');
        audioEl.controls = true;
        audioEl.style.width = '100%';
        audioEl.innerHTML = `
          <source src="${audioPath}" type="audio/wav" />
          Your browser does not support the audio element.
        `;
        audioBlock.appendChild(audioEl);

        const pathEl = document.createElement('div');
        pathEl.style.fontSize = '12px';
        pathEl.style.color = '#666';
        pathEl.style.marginTop = '5px';
        pathEl.style.wordBreak = 'break-all';
        pathEl.textContent = "Prompt: " + audioPrompt;
        audioBlock.appendChild(pathEl);

        methodsRow.appendChild(audioBlock);
      });

      methodContainer.appendChild(methodsRow);
      container.appendChild(methodContainer);
    });

    gallery.appendChild(container);
  });
}

fetchData();
