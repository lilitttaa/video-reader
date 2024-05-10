import re
from typing import List
from bs4 import BeautifulSoup
import requests
from youtube_transcript_api import YouTubeTranscriptApi


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
        try:
            video_id = re.findall(r'v=(\w+)',url)[0]
            return video_id
        except Exception as e:
            print("Error in _retrival_video_id_from_url",e)
            return None
        
    
    def get_transcript(self)->List[dict]:
        video_id = self._retrival_video_id_from_url(self._url)
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            
            return transcript_list
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
    def write_transcript(self,transcript:List[dict], file_path:str):
        with open(file_path, 'w', encoding='utf-8') as f:
            for line in transcript:
                f.write(f"{line['text']}\n")
        return file_path
    
    
    
