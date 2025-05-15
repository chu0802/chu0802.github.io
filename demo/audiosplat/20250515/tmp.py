
from pathlib import Path
import json


with open("imagenet_1000_results.json", "r") as f:
    data = json.load(f)

for k, v in data.items():
    v["image_path"] = Path("")

with open("imagenet_1000_results_new.json", "w") as f:
    json.dump(data, f, indent=4)
