import os
import wave
import pyaudio
import threading
import queue
import time
from faster_whisper import WhisperModel
from langchain.schema import HumanMessage, AIMessage
import re
import requests
from langchain_community.chat_models import ChatOpenAI
from dotenv import load_dotenv 
import sys
import select
import time
from extractDoc import patient_data

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

NEON_GREEN = '\033[32m'
RESET_COLOR = '\033[0m'

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# append to full transcription file
with open("./assets/MD_full.txt", 'w') as file:
    file.write(patient_data)

# also add to the top of ./assets/MD_full.txt
messages_medication = [HumanMessage(content = "You will receive data from a doctor-patient conversation. Analyze for any errors the doctor may have made in medication prescribed or advised. Only respond if an error occurs, with a statement of that error in 10 words or less. Do not mention any other issues.")]
messages_medication.append(HumanMessage(content=patient_data))
messages_diagnosis = [HumanMessage(content = "Analyze the following doctor-patient conversation for any errors related to diagnosis. Respond only if an error occurs, with a diagnosis error statement in 10 words or less. Focus solely on diagnosis and avoid mentioning other topics.")]
messages_diagnosis.append(HumanMessage(content=patient_data))
messages_clarify = [HumanMessage(content = "Using the doctor-patient conversation context, identify any specific questions the doctor should ask for a clearer diagnosis. Only respond with one concise question for clarification, max 10 words. Do not mention other aspects.")]
messages_clarify.append(HumanMessage(content=patient_data))
patient_questions = [HumanMessage(content = "Analyze the conversation and respond with one concise question the patient should ask the doctor, max 10 words. Focus solely on the patient’s perspective for better understanding. Do not include other topics. Only respond with a question if it is a needed question for patient safety. If it isnt, do not respond.")]
patient_questions.append(HumanMessage(content=patient_data))
messages_facxtors = [HumanMessage(content = "this is the start of the convo. You will get a bunch of blurbs of text that are part of a conversation happening between a doctor and a patient. Using the context of the convo, please only respond with concise responses of factors that may have been missed by the doctor in the diagnosis of the patient. Do not reply to this message. Every message after this will be an addition to the conversation and only respond if you think there is something the doctor should ask or clarify. Only respond with one factor that you think should be asked or clarified and make sure it is concise.")]
hundred_txt = ""
hundred_txt_syn = ""

record_queue = queue.Queue()
transcribe_queue = queue.Queue()


def record_audio(p, stream, chunk_length=3):
    while True:
        frames = []
        for _ in range(0, int(16000 / 1024 * chunk_length)):
            data = stream.read(1024, exception_on_overflow=False)
            frames.append(data)

        file_path = f"temp_chunk_{int(time.time())}.wav"
        with wave.open(file_path, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
            wf.setframerate(16000)
            wf.writeframes(b''.join(frames))

        record_queue.put(file_path)

def transcribe_audio(model):
    while True:
        file_path = record_queue.get()
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue

        transcription = ''
        try:
            segments, _ = model.transcribe(file_path, beam_size=5)
            transcription = ''.join(segment.text for segment in segments)
        except Exception as e:
            print(f"Error during transcription: {e}")
        finally:
            os.remove(file_path)
            transcribe_queue.put(transcription)
            # print(NEON_GREEN + transcription + RESET_COLOR)

def process_transcriptions():
    global hundred_txt
    chat_model = ChatOpenAI(openai_api_key=api_key)
    while True:
        transcription = transcribe_queue.get()
        if transcription:
            hundred_txt += " " + transcription
            words = hundred_txt.split()  
            words2 = hundred_txt.split()
            if len(words) >= 20:
                md = metadata(hundred_txt)
                medication_errors(md)
                diagnosis_errors(hundred_txt)
                clarify_questions(hundred_txt)
                with open('./assets/MD_full.txt', 'a') as file:
                    file.write(hundred_txt + "\n")
                hundred_txt = ""
                print("reset")
            if len(words2) >= 40:
                patient_question_helper(words2)
                hundred_txt = ""
            print(NEON_GREEN + transcription + RESET_COLOR)

def patient_question_helper(txt):
    chat_model = ChatOpenAI(openai_api_key=api_key)
    patient_questions.append(HumanMessage(content=txt)) 
    result = chat_model.predict_messages(patient_questions)
    write_content = result.content
    print("patient question: " + write_content)
    with open('./assets/patient_question.txt', 'w') as file:
        file.write(write_content)

def metadata(text):
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "The following prompt is part of a conversation between a patient and doctor..."},
            {"role": "user", "content": text}
        ],
        "temperature": 0.7
    }
    response = requests.post(url, headers=headers, json=data)
    response_json = response.json()
    if 'choices' in response_json:
        tt = response_json['choices'][0]['message']['content']
        with open('./assets/MD_metadata.txt', 'a') as file:
            file.write(tt + "\n")
        return tt
    else:
        print(f"Error: 'choices' not found in the response: {response_json}")
        return "Error: Unable to retrieve metadata"

def medication_errors(metadata):
    chat_model = ChatOpenAI(openai_api_key=api_key)
    messages_medication.append(HumanMessage(content=metadata)) 
    result = chat_model.predict_messages(messages_medication)
    write_content = result.content
    print("medication_errors: " + write_content)
    with open('./assets/MD_medication_return.txt', 'a') as file:
        file.write(write_content + "\n")

def diagnosis_errors(txt):
    chat_model = ChatOpenAI(openai_api_key=api_key)
    messages_diagnosis.append(HumanMessage(content=txt)) 
    result = chat_model.predict_messages(messages_diagnosis)
    write_content = result.content
    print("diagnosis_errors: " + write_content)
    with open('./assets/MD_diagnosis_return.txt', 'a') as file:
        file.write(write_content + "\n")

def clarify_questions(text):
    chat_model = ChatOpenAI(openai_api_key=api_key)
    messages_clarify.append(HumanMessage(content=text)) 
    result = chat_model.predict_messages(messages_clarify)
    write_content = result.content
    print("clarifying question: " + write_content)
    with open('./assets/MD_question_return.txt', 'a') as file:
        file.write(write_content + "\n")

def is_spacebar_pressed():
    i, o, e = select.select([sys.stdin], [], [], 0)
    if i:
        return sys.stdin.read(1) == ' '
    return False

def main():
    model = WhisperModel("medium", device="cpu", compute_type="float32")
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)

    record_thread = threading.Thread(target=record_audio, args=(p, stream))
    transcribe_thread = threading.Thread(target=transcribe_audio, args=(model,))
    process_thread = threading.Thread(target=process_transcriptions)

    record_thread.daemon = True
    transcribe_thread.daemon = True
    process_thread.daemon = True

    record_thread.start()
    transcribe_thread.start()
    process_thread.start()

    try:
        start_time = time.time()
        while True:
            if is_spacebar_pressed():
                print("Spacebar pressed, terminating stream...")
                break
            if time.time() - start_time > 120:
                print("2 minutes passed, exiting...")
                break
            with open('./assets/turn_off.txt', 'r') as file:
                x = file.read()
            if x == "1":
                print("turn off")
                break
    except KeyboardInterrupt:
        print("Interrupted")
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

if __name__ == "__main__":
    main()
