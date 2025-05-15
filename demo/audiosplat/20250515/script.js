const ITEMS_PER_PAGE = 1000;
const ITEMS_PER_ROW = 3;
const audioSeed = "1102";
const audioBasePath = "our_dataset";

let allData = {};
let currentPage = 0;

async function fetchData() {
  // Load both data.json and audio_folders.json
  const [dataRes, folderRes] = await Promise.all([
    fetch('imagenet_1000_results.json'),
    fetch('root_dir.json')
  ]);

  const [dataJson, audioFolders] = await Promise.all([
    dataRes.json(),
    folderRes.json()
  ]);

  // Extract valid labels from folder names (e.g., "0102_Echidna" -> "0102")
  const validLabels = new Set(audioFolders.map(folder => folder.split('/').at(-1).split('_')[0]));
  console.log(validLabels)
  // Filter data.json entries by label
  allData = Object.fromEntries(
    Object.entries(dataJson).filter(([label]) =>
      validLabels.has(label.padStart(4, '0'))
    )
  );

  renderPagination();
  renderPage(0);
}

function simplifyImagePath(fullPath) {
  const parts = fullPath.split('/');
  return `images/${parts.at(-2)}/${parts.at(-1)}`;
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const keys = Object.keys(allData);
  const totalPages = Math.ceil(keys.length / ITEMS_PER_PAGE);

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

  const keys = Object.keys(allData).slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const rows = [];

  for (let i = 0; i < keys.length; i += ITEMS_PER_ROW) {
    const rowItems = keys.slice(i, i + ITEMS_PER_ROW);
    const row = {
      description: `Objects ${page * ITEMS_PER_PAGE + i + 1} - ${page * ITEMS_PER_PAGE + i + rowItems.length}`,
      items: rowItems.map(label => {
        const obj = allData[label];
        const folderName = `${label.padStart(4, '0')}_${obj.object_name}`;
        return {
          label,
          img: simplifyImagePath(obj.image_path),
          audios: obj.interaction.map(interaction => ({
            description: interaction,
            src: `${audioBasePath.replace(/ /g, '_')}/${folderName.replace(/ /g, '_')}/${interaction.replace(/ /g, '_')}_${audioSeed}.wav`
          }))
        };
      })
    };
    rows.push(row);
  }

  rows.forEach(rowData => {
    const container = document.createElement('div');
    container.classList.add('row-container');

    const descEl = document.createElement('div');
    descEl.classList.add('row-description');
    descEl.textContent = rowData.description;
    container.appendChild(descEl);

    const rowEl = document.createElement('div');
    rowEl.classList.add('row');

    rowData.items.forEach(itemData => {
      const itemEl = document.createElement('div');
      itemEl.classList.add('item');

      const numEl = document.createElement('div');
      numEl.classList.add('item-number');
      numEl.textContent = itemData.label;
      itemEl.appendChild(numEl);

      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('img-container');
      const imgEl = document.createElement('img');
      imgEl.src = itemData.img;
      imgEl.alt = 'Demo Image';
      imgWrapper.appendChild(imgEl);
      itemEl.appendChild(imgWrapper);

      itemData.audios.forEach(audioData => {
        const audioBlock = document.createElement('div');
        audioBlock.classList.add('audio-block');
        audioBlock.innerHTML = `
          <audio controls>
            <source src="${audioData.src}" type="audio/wav" />
            您的瀏覽器不支持 audio 標籤。
          </audio>
          <div class="audio-description">${audioData.description}</div>
        `;
        itemEl.appendChild(audioBlock);
      });

      rowEl.appendChild(itemEl);
    });

    container.appendChild(rowEl);
    gallery.appendChild(container);
  });
}

fetchData();
