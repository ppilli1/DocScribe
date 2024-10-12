import os
import wave
import pyaudio
from faster_whisper import WhisperModel
import threading
import time
from langchain.schema import HumanMessage, AIMessage
import re
import requests
from langchain_community.chat_models import ChatOpenAI
from dotenv import load_dotenv 
import sys
import select
import time



load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

NEON_GREEN = '\033[32m'
RESET_COLOR = '\033[0m'



os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"


messages_medication = [HumanMessage(content = "this is the start of the convo. You will get a bunch of data of what is happening in a conversation between a doctor and a patient. Using the context of the convo, please only respond with concise responses of errors the doctor may have made with medication prescribed or told the patient to take based on what the patient described as their problem. Do not reply to this message. Every message after this will be an addition to the data and only respond if you think there has been some sort of error medication related. your response should be very concise and only be a statement stating the error made with medication.")]
messages_diagnosis = [HumanMessage(content = "this is the start of the convo. You will get a bunch of blurbs of text that are part of a conversation happening between a doctor and a patient. Using the context of the convo, please only respond with concise responses of errors the doctor may have made with the diagnosis based on what the patient described as their problem. Do not reply to this message. Every message after this will be an addition to the conversation and only respond if you think there has bees some sort of error diagnosis related. your response should be very concise and only be a statement stating the error made with diagnosis.")]
messages_clarify = [HumanMessage(content = "this is the start of the convo. You will get a bunch of blurbs of text that are part of a conversation happening between a doctor and a patient. Using the context of the convo, please only respond with concise responses of questions that need to be clarified based on what the patient described as their problem or questions the doctor should ask to make a better diagnosis. Do not reply to this message. Every message after this will be an addition to the conversation and only respond if you think there is something the doctor should ask or clarify. Only respond with one question that you think should be asked or clarified and make sure it is concise.")]

hundred_txt = ""
hundred_txt_syn = ""

# Event for synchronizations
file_ready_events = [threading.Event(), threading.Event()]

# Record chunk function
def record_chunk(p, stream, file_path, ready_event, chunk_length=5):
    frames = []
    try:
        for _ in range(0, int(16000 / 1024 * chunk_length)):
            data = stream.read(1024, exception_on_overflow=False)
            frames.append(data)
    except OSError as e:
        print(f"Error recording chunk: {e}")
        return

    wf = wave.open(file_path, 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)
    wf.writeframes(b''.join(frames))
    wf.close()

    ready_event.set() 


def transcribe_chunk(model, file_path, ready_event):
    ready_event.wait()  
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return ""  # Handle the missing file scenario
        segments, _ = model.transcribe(file_path, beam_size=5)
        transcription = ''.join(segment.text for segment in segments)
    finally:
        ready_event.clear() 
    return transcription


def transcription_worker(model, file_paths, events):
    current_file_index = 0
    hundred_txt = ""
    while True:
        transcription_file = file_paths[current_file_index]
        
        transcription = transcribe_chunk(model, transcription_file, events[current_file_index])
        hundred_txt = hundred_txt + " " + transcription

        words = hundred_txt.split()  

        if len(words) >= 20:
            md = metadata(hundred_txt)
            medication_errors(md)
            diagnosis_errors(hundred_txt)
            clarify_questions(hundred_txt)
            with open('./assets/MD_full.txt', 'a') as file:
                file.write(hundred_txt)
                file.write("\n")
            hundred_txt = ""
            print("reset")
        print(NEON_GREEN + transcription + RESET_COLOR)

        if os.path.exists(transcription_file):
            os.remove(transcription_file)
        else:
            print(f"File not found for deletion: {transcription_file}")
        
        current_file_index = (current_file_index + 1) % 2

        time.sleep(0.5)  
        
def metadata(text : str):
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }

    diagnosis = text

    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "The following prompt is part of a conversation between a patient and doctor..."},
            {"role": "user", "content": diagnosis}
        ],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=data)
    
    # Print the response for debugging purposes
    print(f"API Response: {response.json()}")

    # Safely handle missing keys
    response_json = response.json()
    if 'choices' in response_json:
        tt = response_json['choices'][0]['message']['content']
        with open('./assets/MD_metadata.txt', 'a') as file:
            file.write(tt)
            file.write("\n")
        return tt
    else:
        print(f"Error: 'choices' not found in the response: {response_json}")
        return "Error: Unable to retrieve metadata"
    
def medication_errors(metadata : str):
    #use langchain with adding metadata to get the medication errors
    chat_model = ChatOpenAI(openai_api_key = api_key)
    
    messages_medication.append(HumanMessage(content = metadata)) 

    result = chat_model.predict_messages(messages_medication)

    write_content = result.content
    print("medication_errors: " + write_content)
    with open('./assets/MD_medication_return.txt', 'a') as file:
        file.write(write_content)
        file.write("\n")
    
def diagnosis_errors(txt : str):
    #use langchain with the whole convo to get the diagnosis errors
    chat_model = ChatOpenAI(openai_api_key = api_key)
    
    messages_diagnosis.append(HumanMessage(content = txt)) 

    result = chat_model.predict_messages(messages_diagnosis)

    write_content = result.content
    print("diagnosis_errors: " + write_content)
    with open('./assets/MD_diagnosis_return.txt', 'a') as file:
        file.write(write_content)
        file.write("\n")
    
def clarify_questions(text : str):
    #use langchain to get the questions that need to be clarified
    chat_model = ChatOpenAI(openai_api_key = api_key)
    
    messages_clarify.append(HumanMessage(content = text)) 

    result = chat_model.predict_messages(messages_clarify)

    write_content = result.content
    print("clarifying question: " + write_content)
    with open('./assets/MD_question_return.txt', 'a') as file:
        file.write(write_content)
        file.write("\n")

    
def memory_use_diagnosis(text : str):
    #messages.append(HumanMessage(content = text + "This is how far the conversation has reached. Is there a very concise question you want the doctor to see that would help him or her understand the situation better?"))
    pass


def is_spacebar_pressed():
    # Check if input is ready
    i, o, e = select.select([sys.stdin], [], [], 0)
    if i:
        return sys.stdin.read(1) == ' '
    return False


def main2():
    model = WhisperModel("medium", device="cpu", compute_type="float32")
    p = pyaudio.PyAudio()


    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)

    file_paths = ["temp_chunk_1.wav", "temp_chunk_2.wav"]
    current_file_index = 0


    transcription_thread = threading.Thread(target=transcription_worker, args=(model, file_paths, file_ready_events))
    transcription_thread.daemon = True
    transcription_thread.start()
    


    

    try:
        start_time = time.time()
        while True:
            current_time = time.time()
            if is_spacebar_pressed():
                print("Spacebar pressed, terminating stream...")
                break
            if current_time - start_time > 120:
                print("1 minute has passed, exiting loop.")
                break
            current_file_index = (current_file_index + 1) % 2 
            record_chunk(p, stream, file_paths[current_file_index], file_ready_events[current_file_index], chunk_length=10)

    except KeyboardInterrupt: 
        print("Interrupted")

    finally:
        stream.stop_stream()
        stream.close()
        p.terminate() 
        


if __name__ == "__main__":
    main2()
