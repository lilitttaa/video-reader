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

with open("config.json", "r") as f:
    config = json.load(f)
    validation_error_log_path = config["validation_error_log_path"]
    validation_statistic_path = config["validation_statistic_path"]
    validation_db_path = config["validation_db_path"]
    unreal_cmd_path = config["unreal_cmd_path"]
    em_project_path = config["em_project_path"]
    validation_config_path = config["validation_config_path"]
    svn_repo_path = config["svn_repo_path"]

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


class ValidationExecutor:
    def __init__(self):
        self.start_time: datetime = None
        self.duration: int = 0
        self.uuid: int = uuid.uuid4().hex
        self.exit_code: int = 0
        self.error_info: str = ""
        self.statistic_info: str = ""

    async def execute(self, command: str):
        self.start_time = datetime.datetime.now()
        svn.update_svn_repo(svn_repo_path)
        
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,  # 确保输出是字符串而不是字节
        )

        # # 异步读取输出
        stdout_data, stderr_data = process.communicate()
        self._log(stdout_data, stderr_data)

        self.exitCode = process.returncode

        # 读取错误信息Log文件
        error_file_path = validation_error_log_path
        statistic_file_path = (
            validation_statistic_path
        )
        with open(error_file_path, "r", encoding="utf-8-sig") as f:
            self.error_info = f.read()

        parser = ValidationErrorParser()
        error_infos = parser.parse(self.error_info)
        for error_info in error_infos:
            print("asset:",error_info['asset_path'])
            latest_commit_info = svn.get_latest_svn_commit_info_before_time(self.start_time, error_info['asset_path'])
            if latest_commit_info:
                error_info["latest_commit_info"] = {
                    "revision": latest_commit_info.revision,
                    "author": latest_commit_info.author,
                }
            else:
                error_info["latest_commit_info"] = {
                    "revision": 'Unknown',
                    "author": 'Unknown author, asset has been deleted'
                }
        self.error_info = json.dumps(error_infos)

        with open(statistic_file_path, "r") as f:
            self.statistic_info = f.read()

        self.duration = (datetime.datetime.now() - self.start_time).total_seconds()

        gDatabase.add_validation_info(
            ValidationInfo(
                id=self.uuid,
                start_time=self.start_time,
                duration=self.duration,
                status=error_code_2_status(self.exit_code),
                statistic_info=self.statistic_info,
                error_info=self.error_info,
            )
        )

        # 根据退出码处理结果
        if self.exit_code == 0:
            # 处理成功情况
            print("Command executed successfully.")
        elif self.exit_code == 1:
            # 处理其他错误情况
            print("An error occurred while executing the command.")
        else:
            # 处理失败情况
            print("Command execution failed with exit code:", self.exit_code)

    def _log(self, stdout_data: str, stderr_data: str):
        if stdout_data:
            app.logger.info("Standard Output:")
            app.logger.info(stdout_data)

        if stderr_data:
            app.logger.info("Standard Error:")
            app.logger.info(stderr_data)


class ValidationWorker(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.command = unreal_cmd_path+" "+em_project_path+" -Run=DataValidation -Validator=/Script/EMEditor.EMAssetValidator  -Config="+validation_config_path
        self.executor = ValidationExecutor()
        self.is_running = False

    def run(self):
        if self.is_running:
            return
        self.is_running = True
        self.run_internal()
        self.is_running = False
        return

    def run_internal(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            loop.run_until_complete(self.executor.execute(self.command))
        except Exception as e:
            tb_str = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
            app.logger.info(tb_str)
        finally:
            loop.close()


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


gWorker = ValidationWorker()
gDatabase = ValidationDatabaseWrapper(
    validation_db_path
)
svn = SVNClient()

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
        if gWorker.is_running:
            return {"status": "already running"}, 200
        gWorker.start()
        return {"status": "started"}, 200


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

@rest_api.route("api/video_info")
class VideoInfo(Resource):
    def post(self):
        try:
            req_data = request.get_json()
            url = req_data.get("url")
            youtube = YoutubeScrapy(url)
            title = youtube.get_title()
            description = youtube.get_description()
            return {"title": title, "description": description}, 200
        except Exception as e:
            return {"error": str(e)}, 500
    

# class Translator:
#     def __init__(self):
#         pass

#     def translate(self, text: str, target_language: str) -> str:
#         return "translated text"


if __name__ == "__main__":
    app.run()

