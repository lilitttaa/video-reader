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
 
def test_Given_youtube_url_When_fetch_and_write_transcript_Then_return_transcript_file():
    url = 'https://www.youtube.com/watch?v=iMPWx1v7ioM'
    youtube = YoutubeScrapy(url)
    transcript = youtube.get_transcript()
    file_path = 'transcript.txt'
    print('transcript:', transcript)
    youtube.write_transcript(transcript, file_path)
    assert os.path.exists(file_path)  # TODO check the file content
    

def test_langchain_transcript_loader():
    url = 'https://www.youtube.com/watch?v=A2-n6z8fjMM&t=4s'
    youtube = YoutubeScrapy(url)
    transcript = youtube.get_transcript_by_langchain()
    from langchain_text_splitters import CharacterTextSplitter
    text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=1000, chunk_overlap=0
    )
    split_docs = text_splitter.split_documents(transcript)
    print("split_docs:", split_docs)

def test_moonshot_llm():
    from langchain_community.llms.moonshot import Moonshot
    import os
    # Generate your api key from: https://platform.moonshot.cn/console/api-keys
    # os.environ["MOONSHOT_API_KEY"] = "MOONSHOT_API_KEY"
    llm = Moonshot()
    # or use a specific model
    # Available models: https://platform.moonshot.cn/docs
    # llm = Moonshot(model="moonshot-v1-128k")
    # Prompt the model
    print(llm.invoke("What is the difference between panda and bear?"))
    

def test_moonshot_summerize():
    from langchain.chains.summarize import load_summarize_chain
    from langchain_community.document_loaders import WebBaseLoader
    from langchain_community.llms.moonshot import Moonshot
    from langchain_text_splitters import CharacterTextSplitter
    from langchain.chains.llm import LLMChain
    from langchain_core.prompts import PromptTemplate
    from langchain.chains.combine_documents.stuff import StuffDocumentsChain
    from langchain.chains.combine_documents.map_reduce import MapReduceDocumentsChain
    from langchain.chains.combine_documents.reduce import ReduceDocumentsChain
    llm = Moonshot()
    # Map
    map_template = """The following is a set of documents
    {docs}
    Based on this list of docs, please identify the main themes 
    Helpful Answer:"""
    map_prompt = PromptTemplate.from_template(map_template)
    map_chain = LLMChain(llm=llm, prompt=map_prompt)
    
    # Reduce
    reduce_template = """The following is set of summaries:
    {docs}
    Take these and distill it into a final, consolidated summary of the main themes. 
    Helpful Answer:"""
    reduce_prompt = PromptTemplate.from_template(reduce_template)
    # Run chain
    reduce_chain = LLMChain(llm=llm, prompt=reduce_prompt)
    combine_documents_chain = StuffDocumentsChain(
        llm_chain=reduce_chain, document_variable_name="docs"
    )
    # Combines and iteratively reduces the mapped documents
    reduce_documents_chain = ReduceDocumentsChain(
        # This is final chain that is called.
        combine_documents_chain=combine_documents_chain,
        # If documents exceed context for `StuffDocumentsChain`
        collapse_documents_chain=combine_documents_chain,
        # The maximum number of tokens to group documents into.
        token_max=8000,
    )
    
    # Combining documents by mapping a chain over them, then combining results
    map_reduce_chain = MapReduceDocumentsChain(
        # Map chain
        llm_chain=map_chain,
        # Reduce chain
        reduce_documents_chain=reduce_documents_chain,
        # The variable name in the llm_chain to put the documents in
        document_variable_name="docs",
        # Return the results of the map steps in the output
        return_intermediate_steps=False,
    )

    loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
    docs = loader.load()

    text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=1000, chunk_overlap=0
    )
    split_docs = text_splitter.split_documents(docs)
    # print("split_docs:", split_docs)
    print(map_reduce_chain.run(split_docs))

@pytest.mark.current
def test_Given_youtube_url_When_retrieval_video_id_Then_return_video_id():
    url = 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    youtube = YoutubeScrapy(url)
    video_id = youtube.retrival_video_id_from_url(url)
    assert video_id == '9bZkp7q19f0'
    
    url = 'https://www.youtube.com/watch?v=-KzJFzb-HQg&list=PL0Aonm3ZdM4S4VBR1wjtfCL9nPXVFbbWh&index=26'
    video_id = youtube.retrival_video_id_from_url(url)
    assert video_id == '-KzJFzb-HQg'
    