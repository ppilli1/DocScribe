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
import spc
import json


load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")


def mainAnalysis():
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
    
    questions_list = json.loads(tt)


    with open("./assets/refined_questions.txt", "a") as file:
        for question in questions_list:
            file.write(question + "\n")
    
    
    
def contradiction_analysis():
    transcript_path = './assets/MD_full.txt'

    with open(transcript_path, 'r') as file:
        text_content = file.read()

    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You will be given a full transcript of a conversation between a doctor and a patient. Please analyze the transcript and return all the sentences or anything said by the patient, not the doctor."},
            {"role": "user", "content": "This is the transcript of the conversation: " + text_content},
        ],
        "temperature": 0.7
    }
    response = requests.post(url, headers=headers, json=data)
    

    # Safely handle missing keys
    response_json = response.json()
    if 'choices' in response_json:
        tt = response_json['choices'][0]['message']['content']

    contradictions = spc.space(tt)
    print("Number of contradictions: " + str(contradictions))
    


    if contradictions >= 3:
        with open("./assets/refined_questions.txt", "a") as file:

            file.write("The patient's transcription contained 3 or more contradictions, so you may want to run through their exact problem step by step with them." + "\n")

def improve():
    transcript_path = './assets/MD_full.txt'
    with open(transcript_path, 'r') as file:
        text_content = file.read()
        
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You will be given a full transcript of a conversation between a doctor and a patient. Please analyze the transcript and return a single sentence that summarized one thing the doctor could have done better during this encounter to have made a better experience in terms of patient safety. Please respond with a sentence no longer than 10 words that summarizes one thing the doctor could improve on next time that could lead to better patient safety in regards to the context of the transcript provided."},
            {"role": "user", "content": "This is the transcript of the conversation: " + text_content},
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
        with open('./assets/improvement.txt', 'a') as file:
            file.write(tt + "\n")


def refine():
    mainAnalysis()
    contradiction_analysis()
    improve()
    
    
if __name__ == "__main__":
    refine()