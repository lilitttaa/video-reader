import os
import pytest
from backend.translator import translate_content
from backend.youtube_crapy import YoutubeScrapy


def test_Given_youtube_url_and_When_fetch_transcript_Then_return_transcript():
    url = 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    youtube = YoutubeScrapy(url)
    transcript = youtube.get_transcript()
    assert transcript is not None  # TODO check the transcript content
 
@pytest.mark.asyncio
async def test_Given_english_text_When_translate_to_chinese_Then_return_chinese_text():
    content = 'Hello, how are you?'
    output_lang = 'zh-CN'
    translated_content = await translate_content(content, output_lang)
    assert translated_content is not None  # TODO check the translated content
 
@pytest.mark.current
def test_Given_youtube_url_When_fetch_and_write_transcript_Then_return_transcript_file():
    url = 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    youtube = YoutubeScrapy(url)
    transcript = youtube.get_transcript()
    file_path = 'transcript.txt'
    print('transcript:', transcript)
    youtube.write_transcript(transcript, file_path)
    assert os.path.exists(file_path)  # TODO check the file content