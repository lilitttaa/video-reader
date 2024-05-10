import pytest
from backend.youtube_crapy import YoutubeScrapy


def test_Given_youtube_url_and_When_fetch_transcript_Then_return_transcript():
	url = 'https://www.youtube.com/watch?v=9bZkp7q19f0'
	youtube = YoutubeScrapy(url)
	transcript = youtube.get_transcript()
	assert transcript is not None  # TODO check the transcript content