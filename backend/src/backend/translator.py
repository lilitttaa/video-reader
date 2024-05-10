import g4f
from tenacity import retry, stop_after_attempt
from g4f.models import Model, RetryProvider, Liaobots,FreeGpt,You,ChatgptNext,OpenaiChat
g4f.debug.logging = True

PROVIDER_MAPPING = {
    f'g4f.Provider.{provider}': getattr(g4f.Provider, provider)
    for provider in g4f.Provider.__all__
}
try:
    PROVIDER = PROVIDER_MAPPING[os.environ.get('PROVIDER')]
except:
    PROVIDER = None


@retry(stop=stop_after_attempt(15))
async def chat_completion(query: str) -> str:
    response = await g4f.ChatCompletion.create_async(
        model=g4f.models.gpt_35_long,
        messages=[{"role": "user", "content": query}],
        provider=RetryProvider([
        FreeGpt,
        You,
        ChatgptNext,
        OpenaiChat,
    ])
    )
    if response == '' or response is None:
        raise Exception
    return response


async def translate_content(content: str, output_lang: str) -> str: #TODO outputlang should be enum
    """Use GPT for translation"""
    if output_lang == 'en':
        output_lang = 'English version'
    elif output_lang == 'zh-TW':
        output_lang = '台灣繁體中文版(Traditional Chinese)'
    elif output_lang == 'zh-CN':
        output_lang = '简体中文(Simplified Chinese)'

    translate_query = (
        f'Translate the following markdown context to [{output_lang}], '
        'adhere to the following rules:\n'
        '1. Maintain the original format, symbols, and spacing of the text.\n'
        '2. Only provide me with the translated text result, without any descriptions.\n'
        '3. Translate all the content of the text accurately, preserving line breaks.\n'
        '4. Display all punctuation marks and parentheses in half-width characters.\n'
        '5. Avoid translate the text in code block or inline code.\n'
        '6. Avoid using the ```markdown ``` code block notation.\n'
        '--------------------------------\n'
        f'{content}'
        '--------------------------------\n'
        'Output the result in "markdown code" format:\n'
    )
    response = await chat_completion(translate_query)

    print(f'\033[36mResponse:\n{response}\033[0m')

    return response