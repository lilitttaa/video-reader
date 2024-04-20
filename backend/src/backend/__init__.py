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
from typing import Callable, Dict, List
import uuid
from flask import Flask, request
from flask_cors import CORS
import jwt
from g4f.models import Model, RetryProvider, Liaobots
from g4f.client import Client
from .youtube_crapy import YoutubeScrapy
from .database import ValidationDatabaseWrapper, ValidationInfo
from .svn import SVNClient, SVNCommitInfo

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

@rest_api.route("/api/records/recent")
class RecentRecords(Resource):
    def get(self):
        recent_records = gDatabase.get_recent_records()

        records = []
        for record in recent_records:
            records.append(
                {
                    "id": record.id,
                    "start_time": record.start_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration": record.duration,
                    "status": record.status,
                    "statistic_info": json.loads(record.statistic_info),
                    "error_infos": json.loads(record.error_info),
                }
            )
        return {"records": records}, 200


@rest_api.route("/api/records/all")
class RecentRecords(Resource):
    def get(self):
        recent_records = gDatabase.get_all_records()

        records = []
        for record in recent_records:
            records.append(
                {
                    "id": record.id,
                    "start_time": record.start_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration": record.duration,
                    "status": record.status,
                    "statistic_info": json.loads(record.statistic_info),
                    "error_infos": json.loads(record.error_info),
                }
            )
        return {"records": records}, 200


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

@rest_api.route("/api/video/info")
class VideoInfo(Resource):
    def post(self):
        try:
            req_data = request.get_json()
            url = req_data.get("url")
            youtube = YoutubeScrapy(url)
            title = youtube.get_title()
            description = youtube.get_description()
            zh_title = TranslatorEN2ZH().translate(title)
            zh_description = TranslatorEN2ZH().translate(description)
            return {"title": title, "description": description,"zh_title":zh_title,"zh_description":zh_description}, 200
        except Exception as e:
            return {"error": str(e)}, 500
    

class TranslatorEN2ZH:
    def __init__(self) -> None:
        self._client = Client()

    def translate(self, text: str) -> str:
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
                        "content":"You are a english to chinese translator",
                    },
                    {
                        "role": "user",
                        "content": f'Please translate this text:["Nice to meet you, kangkang. \n Nice to meet you, too."] into (Chinese), and keep the original text format',
                    },
                    {
                        "role": "assistant",
                        "content": "很高兴见到你，康康。\n 我也很高兴见到你。"
                    },
                    {
                        "role": "user",
                        "content": f'Please translate this text:[{text}] into (Chinese), and keep the original text format'
                    }
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception("Failed to translate, error: " + str(e)) from e



if __name__ == "__main__":
    app.run()

