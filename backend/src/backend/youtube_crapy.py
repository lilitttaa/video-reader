import re
from bs4 import BeautifulSoup
import requests


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
