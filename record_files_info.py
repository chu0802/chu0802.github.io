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

def get_file_last_modifiled_date(file_path):
    if file_path.exists():
        if file_path.is_file():
            return file_path.stat().st_mtime
        else:
            latest_modified_date = 0
            for item in file_path.iterdir():
                last_modified = get_file_last_modifiled_date(item)
                if last_modified > latest_modified_date:
                    latest_modified_date = last_modified
            return latest_modified_date
    return 0

def track_homepage_last_modified_date(tracked_files):
    latest_modified_date = 0
    for path in tracked_files:
        file_path = Path(path)
        last_modified = get_file_last_modifiled_date(file_path)
        if last_modified > latest_modified_date:
            latest_modified_date = last_modified
    return time.strftime('%Y/%m/%d', time.localtime(latest_modified_date))

def save_to_json(file_info, output_file):
    with open(output_file, 'w') as f:
        json.dump(file_info, f, indent=4)

def git_process():
    try:
        subprocess.run(["git", "add", "files_info.json"])
        subprocess.run(["git", "add", "last_modified_date.json"])
    except:
        pass

if __name__ == "__main__":
    # track resources directory
    resources_directory = Path("resources")
    output_file = "files_info.json"
    
    files_info, _ = record_files_info(resources_directory)
    save_to_json(files_info, output_file)
    
    # track homepage last modified date
    last_modified_date = track_homepage_last_modified_date(["index.html", "assets/", "resources.html"])
    save_to_json({"lastModifiedDate": last_modified_date}, "last_modified_date.json")
    git_process()
