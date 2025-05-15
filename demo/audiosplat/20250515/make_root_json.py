from pathlib import Path
import json

root_dir = Path("our_dataset")

sub_dirs = [a.as_posix() for a in sorted(list(root_dir.glob("*"))) if a.is_dir()]

with open("root_dir.json", "w") as f:
    json.dump(sub_dirs, f, indent=4)