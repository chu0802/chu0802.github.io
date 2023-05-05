$(document).ready(function() {
    function formatBytes(a,b=0,k=1024){
        a = parseInt(a);
        with(Math){let d=floor(log(a)/log(k));return 0==a?"0 Bytes":parseFloat((a/pow(k,d)).toFixed(max(0,b)))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
    }
    
    function getReturnBlocks(root, e){
        const img_type = ["jpg", "png"];
        const icon_map = {
            "": "file", "txt": "filetype-txt", "html": "file", 
            "pdf": "file", "json": "file", "yaml": "file", "yml": "file", 
            "gz": "file", "zip": "file", "ipynb": "notepad"};

        var obj = new Object();
        obj.parent_dir = e.text().includes("Parent Directory")? true : false;
        obj.name = obj.parent_dir? "..." : e.text().slice(1);
        obj.url = obj.parent_dir? e.attr('href') : root + e.attr('href');
        obj.is_dir = obj.parent_dir || obj.name.at(-1) == "/"
        obj.name = obj.is_dir ? obj.name.slice(0, -1) : obj.name;
        obj.id = CryptoJS.MD5(obj.name).toString();
        obj.size = "";
        obj.date = "";
        obj.type = obj.name.split('.').at(-1);
        obj.is_img = img_type.some(el => obj.name.includes(el))? true : false;
        obj.icon = obj.is_dir? "folder" : icon_map[obj.type];
        if (e.attr('href') !== "/~r09922104/"){
            $.ajax({
                type: 'HEAD',
                url: obj.url
            }).done(function(msg, txt, jqXHR){
                obj.size = obj.is_dir? "Directory" : formatBytes(jqXHR.getResponseHeader('Content-Length'));
                obj.date = obj.is_dir? "" : new Date(jqXHR.getResponseHeader('Last-Modified')).toDateString();
                $(`#${obj.id}`).append(
                    `<small>${obj.size}<span class="date text-muted">${obj.date}</span></small>`
                );

                
            });
            return obj;
        }
        else
            return null;
    }

    function get_files(root){
        $('#files').empty();
        $.ajax({url: root}).then(function(html) {
            // create temporary DOM element
            var document = $(html);
            // find all links ending with .pdf 
            document.find('a').each(function() {
                var obj = getReturnBlocks(root, $(this));
                if (obj)
                    $("#files").append(
                        `
                            <div class="col-lg-3 col-md-4 col-sm-6">
                                <div class="card">
                                    <div class="file">
                                        ${obj.is_dir ? `<a class="dir-link" href="javascript:void(0)" value="${obj.url}">` : `<a href="${obj.url}" download>`}
                                            <div class="icon">
                                                ${obj.is_img? `<img src="${obj.url}">` : `<i class="bx bx-${obj.icon} text-info"></i>`}
                                            </div>
                                            <div class="file-name" id="${obj.id}">
                                                <p class="m-b-5 text-muted">${obj.name}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
                    );
            
            })
        });
    }
    $("#files").on('click', '.dir-link', function(){
        get_files($(this).attr("value"));
        console.log($(this).attr("value"));
    });
    
    get_files("/~r09922104/shared_directory/");
    
    // 
});
