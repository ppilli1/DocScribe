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
def record_chunk():
    transcript_path = './assets/MD_full.txt'
    questions_path = './assets/MD_question_return.txt'
    with open(transcript_path, 'r') as file:
        text_content = file.read()

    with open(questions_path, 'r') as file:
        question_content = file.read()
        
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You will be given a full transcript of a conversation between a doctor and a patient. You will also be given questions that needed to be asked / clarified by the doctor during this conversation. Some of these questions are from earlier in the conversation and may have been answered later in the conversation. Please analyze the transcript and respond with questions from the list of questions given that were not touched upon in the transcript and get rid of those that have. Do not give any questions that were not originally in the list. format it as a python list but do not name it anything. Your response should start with [ and end with ] and put each string in quotations in the list."},
            {"role": "user", "content": "This is the transcript of the conversation: " + text_content},
            {"role": "user", "content": "These are the questions that were asked: " + question_content}
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

        print(tt)
    
    
    
def mainAnalysis():
    pass


if __name__ == "__main__":
    record_chunk()