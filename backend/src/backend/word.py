from openai import OpenAI
from .utils import retry_request
from .config import MOONSHOT_API_KEY

class InterpretGenerator:
    def __init__(self):
        self._client = OpenAI(
            api_key=MOONSHOT_API_KEY,
            base_url="https://api.moonshot.cn/v1",
        )

    def generate_interpret(self, word, context):
        if not self._check_valid(word):
            raise Exception("Invalid input word")
        if not self._check_valid(context):
            raise Exception("Invalid input context")
        return self._request_interpret(word, context)

    @retry_request(3, 3)
    def _request_interpret(self, word, context):
        completion = self._client.chat.completions.create(
            model="moonshot-v1-8k",
            messages=[
                {
                    "role": "user",
                    "content": "".join(
                        [
                            "Please interpret the meaning of the word briefly{",
                            word,
                            "} in this context {",
                            context,
                            "}",
                            "{",
                            word,
                            "} means",
                        ]
                    ),
                }
            ],
            temperature=0.3,
        )
        return completion.choices[0].message.content

    def _check_valid(self, text): # TODO
        text = text.strip()
        if text == "":
            print("Invalid input", text)
            return False
        return True
