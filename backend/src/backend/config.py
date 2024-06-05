import json


with open("config.json", "r",encoding='utf-8') as f:
    config = json.load(f)
    MOONSHOT_API_KEY = config["MOONSHOT_API_KEY"]
    WORD_SAVE_PATH=config["WORD_SAVE_PATH"]
    
