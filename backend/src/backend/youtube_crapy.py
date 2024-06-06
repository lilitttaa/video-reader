import json
import re
from typing import List
from bs4 import BeautifulSoup
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.documents import Document
from urllib.parse import urlparse, parse_qs
from contextlib import suppress
from .utils import retry_request
class YoutubeScrapy:
    def __init__(self,url:str):
        self._url = url
        response = requests.get(url)
        self._soup = BeautifulSoup(response.text, 'html.parser')
        
    def _write_html(self):
        with open('youtube.html', 'w', encoding='utf-8') as f:
            f.write(self._soup.prettify())
    
    def get_title(self)->str:
        title_tag = self._soup.find('meta', property='og:title')
        title = title_tag.get('content') if title_tag else None
        if type(title) == str:
            return title
        elif type(title) == list:
            return title[0]
        else:
            raise Exception("Title not found")

    def get_description(self)->str:
        all_scripts = self._soup.find_all('script')
        for i in range(len(all_scripts)):
            try :
                if 'ytInitialPlayerResponse' in all_scripts[i].string:
                    match = re.findall("shortDescription\":\"(.*?)\",\"",all_scripts[i].string,)[0]
                    return match.replace("\\\"", "\"")
            except Exception as e:
                print("Error in get_description",e)

    def _retrival_video_id_from_url(self,url:str)->str:
        # Examples:
        # - http://youtu.be/SA2iWivDJiE
        # - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
        # - http://www.youtube.com/embed/SA2iWivDJiE
        # - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
        query = urlparse(url)
        if query.hostname == 'youtu.be': return query.path[1:]
        if query.hostname in {'www.youtube.com', 'youtube.com', 'music.youtube.com'}:
            with suppress(KeyError):
                return parse_qs(query.query)['list'][0]
            if query.path == '/watch': return parse_qs(query.query)['v'][0]
            if query.path[:7] == '/watch/': return query.path.split('/')[2]
            if query.path[:7] == '/embed/': return query.path.split('/')[2]
            if query.path[:3] == '/v/': return query.path.split('/')[2]
        
    def get_transcript(self)->List[dict]:
        video_id = self._retrival_video_id_from_url(self._url)
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            return transcript_list
        except Exception as e:
            print(f"An error occurred: {e}")
            return None


    def get_transcript_by_langchain(self)->List[Document]:
        from langchain_community.document_loaders import YoutubeLoader
        loader = YoutubeLoader.from_youtube_url(
            self._url, add_video_info=False
        )
        return loader.load()

        
    def write_transcript(self,transcript:List[dict], file_path:str):
        with open(file_path, 'w', encoding='utf-8') as f:
            for line in transcript:
                f.write(f"{line['text']}\n")
        return file_path
    
    
import time
def write_to_jsonl(title:str, desc:str, text:str):
    obj = {
        "title": title,
        "desc": desc,
        "text": text,
    }
    json_obj = json.dumps(obj, ensure_ascii=False, indent=4)
    with open("transcript.jsonl", "a",encoding="utf-8") as f:
        f.write(json_obj + "\n")

def split_transcript_into_chunks(transcript: List[dict], max_text_count:int)->List[str]:
    chunks = []
    chunk = ""
    chunk_length = 0
    for idx, line in enumerate(transcript):
        text = line["text"]
        if chunk_length + len(text) > max_text_count or idx == len(transcript) - 1:
            chunks.append(chunk)
            chunk = text + " "
            chunk_length = len(text)
        else:
            chunk += text + " "
            chunk_length += len(text)
    return chunks

from openai import OpenAI


@retry_request(3, 3)
def add_punctuation(content):

    client = OpenAI(
        api_key=MOONSHOT_API_KEY,
        base_url="https://api.moonshot.cn/v1",
    )

    completion = client.chat.completions.create(
        model="moonshot-v1-8k",
        messages=[
            {
                "role": "user",
                "content": "".join(
                    [
                        "Add appropriate punctuation to the following:",
                        content
                    ]
                ),
            }
        ],
        temperature=0.3,
    )
    return completion.choices[0].message.content


from concurrent.futures import ThreadPoolExecutor, as_completed

def concurrent_add_punctuation(contents):
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_content = {executor.submit(add_punctuation, content): i for i, content in enumerate(contents)}
        
        results_map = {}
        for future in as_completed(future_to_content):
            idx = future_to_content[future]
            try:
                # 获取future的结果
                result = future.result()
                print(f'idx: {idx}')
            except Exception as exc:
                print(f'generated an exception: {exc}')
            else:
                results_map[idx] = result
        
        return [results_map[i] for i in range(len(contents))]

# url = input("Enter the youtube url: ")
# scrapy = YoutubeScrapy(url)
# title = scrapy.get_title()
# print(f"Title: {title}")
# description = scrapy.get_description()
# print(f"Description: {description}")
# transcript = scrapy.get_transcript()
# chunks = split_transcript_into_chunks(transcript, 4000)

# final_text = ""
# chunks_with_punctuation = concurrent_add_punctuation(chunks)
# for chunk in chunks_with_punctuation:
#     final_text += chunk + " "

# write_to_jsonl(title, description, final_text)

