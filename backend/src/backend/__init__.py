import __future__
import asyncio
import datetime
from functools import wraps
import json
import random
import string
import subprocess
import threading
import time
import traceback
from typing import Callable, Dict, List, Optional
import uuid
from flask import Flask, request
from flask_cors import CORS
import jwt
from g4f.models import Model, RetryProvider, Liaobots
from g4f.client import Client
from .youtube_crapy import YoutubeScrapy,TranscriptSplitter,ConcurrentPunctuationAdder,write_to_jsonl
from .database import (
    ValidationDatabaseWrapper,
    ValidationInfo,
    VideoInfoDatabaseWrapper,
    VideoInfo,
)
from .svn import SVNClient, SVNCommitInfo
from .config import MOONSHOT_API_KEY, WORD_SAVE_PATH
from .word import InterpretGenerator

app = Flask(__name__)
CORS(app)

from flask_restx import Api, Resource, fields

app.debug = True
rest_api = Api(app, version="1.0", title="User API")

user_model = rest_api.model(
    "UserModel",
    {
        "username": fields.String(required=True, min_length=2, max_length=32),
        "email": fields.String(required=True, min_length=4, max_length=64),
        "password": fields.String(required=True, min_length=4, max_length=16),
    },
)

login_model = rest_api.model(
    "LoginModel",
    {
        "email": fields.String(required=True, min_length=4, max_length=64),
        "password": fields.String(required=True, min_length=4, max_length=16),
    },
)

user_edit_model = rest_api.model(
    "UserEditModel",
    {
        "userId": fields.String(required=True, min_length=4, max_length=64),
        "username": fields.String(required=True, min_length=2, max_length=32),
        "email": fields.String(required=True, min_length=4, max_length=64),
    },
)


class User:
    def __init__(self, username: str, email: str):
        self.username = username
        self.email = email
        self.password: str = None
        self.jwt_auth_active: bool = False
        self.id = uuid.uuid4().hex  # TODO

    def set_password(self, password: str):
        self.password = password

    def check_password(self, password: str):
        return self.password == password

    def set_jwt_auth_active(self, active):
        self.jwt_auth_active = active

    def __str__(self) -> str:
        return f"User(username={self.username}, email={self.email},password={self.password}, jwt_auth_active={self.jwt_auth_active})"


class Users:
    def __init__(self):
        self.users: Dict[str, User] = {}

    def get_by_email(self, email: str) -> User:
        return self.users.get(email)

    def add_user(self, user: User):
        self.users[user.email] = user

    def __str__(self) -> str:
        ret = ""
        for user in self.users.values():
            ret += str(user) + "\n"
        return ret


users = Users()
users.add_user(User("admin", "123@123.com"))


@rest_api.route("/api/helloworld")
class HelloWorld(Resource):
    def get(self):
        return {"message": "Hello, World!"}


class BaseConfig:
    SECRET_KEY = None
    if not SECRET_KEY:
        SECRET_KEY = "abcdefghabcdefghabcdefghabcdefgh"  # TODO


def token_required(f):
    @wraps(f)
    def decorated(self, *args, **kwargs):
        token = None
        if "authorization" in request.headers:
            token = request.headers["authorization"]

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            app.logger.info(data)
            current_user = users.get_by_email(data["email"])
            if not current_user:
                return {"message": "User not found"}, 404

        except:
            return {"message": "Token is invalid"}, 403
        return f(self, current_user, *args, **kwargs)

    return decorated


@rest_api.route("/api/users/register")
class UserRegister(Resource):
    @rest_api.expect(user_model, validation=True)
    def post(self):
        app.logger.info("register user")
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        app.logger.info(f"username: {username}, email: {email}, password: {password}")

        user = users.get_by_email(email)
        if user:
            return {"success": False, "msg": "User already exists."}, 400

        new_user = User(username, email)
        new_user.set_password(password)
        users.add_user(new_user)
        return {"success": True, "userId": new_user.id, "email": email}, 201


@rest_api.route("/api/users/login")
class Login(Resource):
    """
    Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):
        req_data = request.get_json()
        _email = req_data.get("email")
        _password = req_data.get("password")

        user = users.get_by_email(_email)
        if user is None:
            return {"success": False, "msg": "User not found."}, 404

        app.logger.info(f"password: {user.password}, _password: {_password}")
        if not (user.password == _password):
            return {"success": False, "msg": "Wrong credentials."}, 400

        # create access token uwing JWT
        token = jwt.encode(
            {
                "email": _email,
                # "exp": datetime.datetime.now() + datetime.timedelta(hours=1),
            },
            BaseConfig.SECRET_KEY,
        )

        user.set_jwt_auth_active(True)
        return {"success": True, "token": token, "userId": user.id}, 200


@rest_api.route("/api/users/test_edit")
class TestEdit(Resource):
    @rest_api.expect(user_edit_model)
    @token_required
    def post(current_user: User, self):
        user = users.get_by_email(current_user.email)
        if not user:
            return {"success": False, "msg": "User not found."}, 404

        return {
            "success": True,
            "userId": current_user.id,
            "email": current_user.email,
        }, 201


@rest_api.route("/api/checkuser")
class CheckUser(Resource):
    def get(self):
        user_str = str(users)
        return {"users": user_str}, 200


def error_code_2_status(errorCode: int) -> str:
    if errorCode == 0:
        return "success"
    elif errorCode == 1:
        return "error"
    else:
        return "failed"


class ValidationErrorInfo:
    def __init__(self, asset_path: str, error_message: str):
        self.asset_path = asset_path
        self.error_message = error_message


class ValidationErrorParser:
    def __init__(self):
        pass

    def parse(self, error_str: str) -> List[ValidationErrorInfo]:
        lines = error_str.split("\n")
        lines = [line.strip() for line in lines if line.strip()]
        error_infos: List[ValidationErrorInfo] = []
        for line in lines:
            parts = line.split("-")
            asset_path = parts[0].strip()
            error_message = parts[1].strip()
            error_info = {
                "asset_path": asset_path,
                "error_message": error_message,
            }
            error_infos.append(error_info)
        return error_infos


@rest_api.route("/api/trigger/status")
class TriggerStatus(Resource):
    def get(self):
        if not gWorker.is_running:
            return {"status": "ready"}, 200
        else:
            return {"status": "running"}, 200


@rest_api.route("/api/trigger/launch")
class Trigger(Resource):
    # @token_required
    def post(self):
        pass



@rest_api.route("/api/test")
class Test(Resource):
    def get(self):
        file_path = validation_error_log_path
        parser = ValidationErrorParser()
        error_infos = parser.parse(file_path)
        for error_info in error_infos:
            app.logger.info(
                f"Asset Path: {error_info.asset_path}, Error Message: {error_info.error_message}"
            )


@rest_api.errorhandler
def default_error_handler(e):
    return {"message": str(e)}, 500


from bs4 import BeautifulSoup
import requests


@rest_api.route("/api/trigger/video")
class Trigger(Resource):
    def post(self):
        try:
            req_data = request.get_json()
            url = req_data.get("url")
            global_queue.push_task(url)
            task_state = global_queue.get_task_state()
            return {"success": True, "task_state": task_state}, 200
        except Exception as e:
            return {"error": str(e)}, 500


@rest_api.route("/api/trigger/task_state")
class TaskState(Resource):
    def get(self):
        task_state = global_queue.get_task_state()
        return {"task_state": task_state}, 200


def video_info_to_dict(video_info: VideoInfo):
    return {
        "id": video_info.id,
        "url": video_info.url,
        "title": video_info.title,
        "title_zh": video_info.title_zh,
        "description": video_info.description,
        "description_zh": video_info.description_zh,
    }


@rest_api.route("/api/video/info")
class VideoInfoAPI(Resource):
    def get(self):
        video_infos = global_database.get_all_video_infos()
        video_infos_obj = []
        for video_info in video_infos:
            video_infos_obj.append(video_info_to_dict(video_info))
        return {"video_infos": video_infos_obj}, 200

words_path = WORD_SAVE_PATH + r"\word_record.jsonl"
word_objs = []
with open(words_path, "r", encoding="utf-8") as f:
    words = f.readlines()
    words = [word.strip() for word in words]
    for word in words:
        word_obj = json.loads(word)
        word_objs.append(word_obj)

transcript_path = WORD_SAVE_PATH + r"\transcript.jsonl"
transcript_objs = []
with open(transcript_path, "r", encoding="utf-8") as f:
    transcripts = f.readlines()
    transcripts = [transcript.strip() for transcript in transcripts]
    for transcript in transcripts:
        transcript_obj = json.loads(transcript)
        transcript_objs.append(transcript_obj)

@rest_api.route("/api/words/list")
class GetWordsList(Resource):
    def get(self):
        return {"words": word_objs}, 200

@rest_api.route("/api/transcript/list")
class GetTranscriptList(Resource):
    def get(self):
        return {"transcripts": transcript_objs}, 200

@rest_api.route('/api/words/add')
class AddWord(Resource):
    def post(self):
        req_data = request.get_json()
        word = req_data.get("word")
        context = req_data.get("context")
        try:
            generator = InterpretGenerator()
            interpret = generator.generate_interpret(word, context)
            # TODO save to jsonl
        except Exception as e:
            return {"success": False, "msg": str(e)}, 500
        return {
            "success": True,
            "data": {
            "word": word,
            "context": context,
            "interpret": interpret
        }
        }, 200

@rest_api.route('/api/transcript/add')
class AddTranscript(Resource):
    def post(self):
        req_data = request.get_json()
        url = req_data.get("url")
        try:
            scarpy = YoutubeScrapy(url)
            title = scarpy.get_title()
            description = scarpy.get_description()
            transcript = scarpy.get_transcript()
            splitter = TranscriptSplitter(transcript, 4000)
            final_text = ""
            chunks_with_punctuation = ConcurrentPunctuationAdder().concurrent_add_punctuation(splitter.split_transcript_into_chunks())
            for chunk in chunks_with_punctuation:
                final_text += chunk + " "
            # write_to_jsonl(title, description, final_text)
        except Exception as e:
            return {"success": False, "msg": str(e)}, 500
        return {
                "success": True,
                "data": {
                "title": title,
                "description": description
            }   
        }, 200

class TranslatorEN2ZH:
    def __init__(self) -> None:
        self._client = Client()

    def translate(self, text: str) -> str:
        app.logger.info("translate:" + text)
        try:
            response = self._client.chat.completions.create(
                model=Model(
                    name="gpt-3.5-turbo",
                    base_provider="openai",
                    best_provider=RetryProvider([Liaobots]),
                ),
                messages=[
                    {
                        "role": "system",
                        "content": "You are a english to chinese translator",
                    },
                    {
                        "role": "user",
                        "content": f'Please translate this text:["Nice to meet you, kangkang. \n Nice to meet you, too."] into (Chinese), and keep the original text format',
                    },
                    {
                        "role": "assistant",
                        "content": "很高兴见到你，康康。\n 我也很高兴见到你。",
                    },
                    {
                        "role": "user",
                        "content": f"Please translate this text:[{text}] into (Chinese), and keep the original text format",
                    },
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception("Failed to translate, error: " + str(e)) from e


global_database = VideoInfoDatabaseWrapper("video.db")  # TODO


class VideoInfoGenerator:
    def __init__(self, url: str):
        self._translator = TranslatorEN2ZH()
        self._url = url

    async def generate(self) -> None:
        print("generate", self._url)
        youtube = YoutubeScrapy(self._url)
        title = youtube.get_title()
        app.logger.info(f"title: {title}")
        description = youtube.get_description()
        app.logger.info(f"description: {description}")
        title_zh = self._translator.translate(title)
        description_zh = self._translator.translate(description)
        global_database.add_video_info(
            VideoInfo(
                id=uuid.uuid4().hex,
                url=self._url,
                title=title,
                description=description,
                title_zh=title_zh,
                description_zh=description_zh,
            )
        )


class VideoInfoGenerateWorker(threading.Thread):
    def __init__(self, url: string, on_worker_finished: Optional[Callable]):
        threading.Thread.__init__(self)
        self._video_info_generator = VideoInfoGenerator(url)
        self.is_running = False
        self._on_worker_finished = on_worker_finished

    def run(self):
        app.logger.info("run worker")
        if self.is_running:
            return
        self.is_running = True
        self.run_internal()
        self.is_running = False
        if self._on_worker_finished:
            self._on_worker_finished()

    def run_internal(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            print("start generate")
            loop.run_until_complete(self._video_info_generator.generate())
        except Exception as e:
            tb_str = "".join(traceback.format_exception(type(e), e, e.__traceback__))
            app.logger.info(tb_str)
        finally:
            loop.close()


class TaskItem:
    def __init__(self, url: str) -> None:
        self.url = url


class TaskQueue:
    def __init__(self) -> None:
        self._tasks: List[TaskItem] = []
        self._running_worker: VideoInfoGenerateWorker = None
        self._running_task: TaskItem = None

    def push_task(self, url: str):
        task_item = TaskItem(url)
        if self._running_task == None and len(self._tasks) == 0:
            self._run_task(task_item)
        else:
            self._tasks.append(task_item)

    def _run_task(self, task_item: TaskItem):
        app.logger.info(f"run task: {task_item.url}")
        self._running_task = task_item
        self._running_worker = VideoInfoGenerateWorker(
            task_item.url, lambda: self._next_task()
        )
        self._running_worker.start()

    def _next_task(self):
        self._running_task = None
        if len(self._tasks) > 0:
            next_task = self._tasks.pop(0)
            self._run_task(next_task)

    def get_task_state(self) -> Dict[str, any]:
        return {
            "running_task": self._running_task.url if self._running_task else None,
            "tasks": [task.url for task in self._tasks],
        }


global_queue = TaskQueue()

# if __name__ == "__main__":
#     app.run()


# url = input("Enter the youtube url: ")
# scrapy = YoutubeScrapy(url)
# title = scrapy.get_title()
# print(f"Title: {title}")
# description = scrapy.get_description()
# print(f"Description: {description}")
# transcript = scrapy.get_transcript()
# splitter = TranscriptSplitter(transcript, 4000)
# final_text = ""
# chunks_with_punctuation = ConcurrentPunctuationAdder().concurrent_add_punctuation(splitter.split_transcript_into_chunks())
# for chunk in chunks_with_punctuation:
#     final_text += chunk + " "

# write_to_jsonl(title, description, final_text)
