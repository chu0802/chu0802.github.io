document.addEventListener("DOMContentLoaded", function() {
    // Function to format file size
    function formatBytes(bytes, decimals = 0, k = 1024) {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
    }


    fetch('files_info.json').then(response => response.json()).then(files => {

        const imgTypes = ["jpg", "png", "jpeg"];
        const iconMap = {
            "": "file", "txt": "filetype-txt", "html": "filetype-html",
            "pdf": "file-pdf", "json": "filetype-json", "yaml": "filetype-yml", "yml": "filetype-yml",
            "gz": "file-zip", "zip": "file-zip", "ipynb": "filetype-py"
        };

        function getDict(jsonObj, path) {
            let value = jsonObj;
            const keys = path.split("/"); // Split the path string by "/"
            console.log(keys);
            for (const key of keys) {
                if (key === "resources"){
                    continue;
                }
                if (value.hasOwnProperty(key)) {
                    value = value[key]["files"];
                } else {
                    // Key not found, return undefined or handle the case as per your requirement
                    return undefined;
                }
            }

            return Object.entries(value);
        }

        function fetchFiles(fs) {
            const filesContainer = document.getElementById('files');
            filesContainer.innerHTML = '';
            console.log(fs);
            fs.forEach(([key, file]) => {
                const metaDiv = document.createElement('div');
                metaDiv.classList.add('col-lg-3', 'col-md-4', 'col-sm-6');

                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                const fileDiv = document.createElement('div');
                fileDiv.classList.add('file');
                const linkElement = document.createElement('a');
                const iconDiv = document.createElement('div');
                iconDiv.classList.add('icon');
            
                if (file.size === "Directory") {
                    linkElement.classList.add('dir-link');
                    linkElement.href = 'javascript:void(0)';
                    fileDiv.addEventListener('click', function() {
                        fetchFiles(getDict(files, file.url));
                    });
                    iconDiv.innerHTML = `<i class="bi bi-folder text-info"></i>`
                }
                else {
                    if (imgTypes.includes(file.type.toLowerCase())) {
                        iconDiv.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
                    }
                    else {
                        iconDiv.innerHTML = `<i class="bi bi-${iconMap[file.type.toLowerCase()]} text-info"></i>`;
                    }
                    console.log(file.size);
                    linkElement.href = file.url;
                    linkElement.download = file.name;
                }
                
                const fileDetailsDiv = document.createElement('div');
                fileDetailsDiv.classList.add('file-name');
                fileDetailsDiv.innerHTML = `<p class="m-b-5 text-muted">${file.name}</p>`;
                fileDetailsDiv.innerHTML += `<small>${file.size === "Directory"? file.size : formatBytes(file.size)}<span class="date text-muted">${file.last_modified}</span></small>`;

                linkElement.appendChild(iconDiv);
                linkElement.appendChild(fileDetailsDiv);
                fileDiv.appendChild(linkElement);
                cardDiv.appendChild(fileDiv);
                metaDiv.appendChild(cardDiv);

                filesContainer.appendChild(metaDiv);
            });
        }

        fetchFiles(getDict(files, "resources"));
    });

});
