from flask import Flask, request
from flask_cors import CORS
import os
import requests
import json
import shutil
from flask import jsonify
import whisperMD

from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_models import ChatOpenAI
app = Flask(__name__)
#specify domain and port for every endpoint
CORS(app, resources={r"/MD": {"origins": "http://localhost:5116"}})
CORS(app, resources={r"/OR": {"origins": "http://localhost:5116"}})
api_key = os.getenv("OPENAI_API_KEY")
messages_red = []

def ty():

    
    with open("./assets/OR_full.txt", 'r') as file:
        file_contents = file.read()
        print("file read")
    url = 'https://hooks.spline.design/J44c_9tGM6w'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'AI5r3atVzdVoqq1etnEbdBXn0rMpkEDfnZL2PlyoDFo',
        'Accept': 'application/json'
    }

    data = {
        "vr": file_contents
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    print(response.status_code)
    print(response.text)
    return "HI"
    
@app.route('/red2', methods=['GET'])
def ty111():
    lol = ty() 
    print(lol)    # This will now only run when the '/red2' endpoint is accessed.
    return "Just say HI"


@app.route('/MD', methods=['POST'])
def MD_logic():
    print("MD logic executed successfully")
    whisperMD.main2()
    return jsonify({"message": "MD logic executed successfully"}), 200



    


if __name__ == '__main__':
    app.run(use_reloader=True, port=5161, threaded=True)