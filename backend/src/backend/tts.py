import ChatTTS
from IPython.display import Audio
import torch
import torchaudio
# import unsafe_float_to_int16
# import get_logger
import wave
# def save_wav_file(wav):
#     wav_filename = f"output_audio_{'test'}.wav"
#     with wave.open(wav_filename, "wb") as wf:
#         wf.setnchannels(1)  # Mono channel
#         wf.setsampwidth(2)  # Sample width in bytes
#         wf.setframerate(24000)  # Sample rate in Hz
#         wf.writeframes(unsafe_float_to_int16(wav))


chat = ChatTTS.Chat()
chat.load_models(source="huggingface", force_redownload=True)

text = "PUT YOUR TEXT HERE"

wav = chat.infer(text)
torchaudio.save("output1.wav", wav, 24000)

