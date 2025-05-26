import json
from pathlib import Path
output_file = Path("methods.json")
demo_folder = Path("output_test")
audio_path = "output_test/{method}/{object}/{audio_name}_1102.wav"

base_prompt_dir = Path("/home/chu980802/langsplat/audio_model/stable_audio_open")
files = {
    "baseline": base_prompt_dir / "baseline_sound_prompts.json",
    "material": base_prompt_dir / "material_sound_prompts.json",
    "environment": base_prompt_dir / "environment_sound_prompts.json",
    "detailed": base_prompt_dir / "detailed_sound_prompts.json",
}

json_files = {}

for k, v in files.items():
    with open(v, "r") as f:
        json_files[k] = json.load(f)

# list all file path in demo_folder, store in a json file
output = {}

for method, json_dict in json_files.items():
    for object, prompt_list in json_dict.items():
        if object not in output:
            output[object] = [{} for _ in range(len(prompt_list))]
        
        for i, prompt in enumerate(prompt_list):
            audio_name = "_".join(prompt.split(" "))
            customized_audio_path = audio_path.format(method=method, object=object, audio_name=audio_name)
            method_name = "only " + method if method in ["material", "environment"] else method
            output[object][i][method_name] = {
                "path": customized_audio_path,
                "prompt": prompt
            }

with open(output_file, "w") as f:
    json.dump(output, f, indent=4)








