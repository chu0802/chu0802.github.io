import json
from pathlib import Path
import time
import subprocess

HTML_ROOT = "https://raw.githubusercontent.com/chu0802/chu0802.github.io/master/"

def get_file_info(file_path):
    # Get file size
    file_size = file_path.stat().st_size
    
    # Get last modified time
    last_modified = time.strftime('%Y-%m-%d %H:%M', time.localtime(file_path.stat().st_mtime))
    
    return {"name": file_path.name, "size": file_size, "last_modified": last_modified, "url": HTML_ROOT + file_path.as_posix(), "type": file_path.suffix[1:]}

def record_files_info(directory_path):
    files_info = {}
    newest_modified = 0
    if directory_path.name != "resources":
        files_info[".."] = {"name": "..", "size": "Directory", "last_modified": "Parent", "url": directory_path.parent.as_posix()}
    for item in directory_path.iterdir():
        if item.is_file():
            files_info[item.name] = get_file_info(item)
            if item.stat().st_mtime > newest_modified:
                newest_modified = item.stat().st_mtime
        elif item.is_dir():
            files, last_modified = record_files_info(item)
            files_info[item.name] = {"name": item.name, "size": "Directory", "last_modified": last_modified, "files": files, "url": item.as_posix()}
    
    return files_info, time.strftime('%Y-%m-%d %H:%M', time.localtime(newest_modified))

def save_to_json(file_info, output_file):
    with open(output_file, 'w') as f:
        json.dump(file_info, f, indent=4)

def git_process():
    try:
        subprocess.run(["git", "add", "files_info.json"])
    except:
        pass

if __name__ == "__main__":
    directory = Path("resources")
    output_file = "files_info.json"
    
    files_info, _ = record_files_info(directory)
    save_to_json(files_info, output_file)
    
    git_process()
