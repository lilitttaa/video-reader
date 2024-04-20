import datetime
import subprocess
from typing import Tuple


class SVNCommitInfo:
    def __init__(self, revision: str, author: str):
        self.revision = revision
        self.author = author

    def is_valid(self):
        return self.revision.startswith("r") and self.author

    def __str__(self):
        return f"revision: {self.revision}, author: {self.author}"


class SVNClient:
    def __init__(self):
        pass

    def get_latest_svn_commit_info_before_time(
        self, date_time: datetime, file_path: str
    ) -> SVNCommitInfo:
        try:
            output = self._execute_svn_command(date_time, file_path)
            [revision, author] = self._parse_commit_info(output)
            return SVNCommitInfo(revision, author)
        except Exception as e:
            print(f"An exception occurred: {e}")

    def _execute_svn_command(self, date_time: datetime, file_path: str):
        # svn_log_command = f"svn log -l 1 {file_path}"
        iso_string = date_time.strftime("%Y-%m-%dT%H:%M:%SZ")
        svn_log_command = (
            f"svn log -r {{{iso_string}}}:{{2020-01-01T00:00:00Z}} -l 1 {file_path}"
        )
        result = subprocess.run(
            svn_log_command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if result.returncode == 0:
            return result.stdout.decode("gbk")
        else:
            raise Exception(f"Error occurred: {result.stderr.decode('gbk')}")

    def _parse_commit_info(self, commit_str: str) -> Tuple[str, str]:
        lines = commit_str.splitlines()
        commit_info = lines[1]
        commit_info_fields = commit_info.split("|")
        revision = commit_info_fields[0].strip()
        author = commit_info_fields[1].strip()
        return revision, author

    def update_svn_repo(self, svn_path: str):
        print("Updating SVN repo...")
        command = f"cd {svn_path} && svn update"
        result = subprocess.run(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if result.returncode == 0:
            return result.stdout.decode("gbk")
        else:
            raise Exception(f"Error occurred: {result.stderr.decode('gbk')}")
