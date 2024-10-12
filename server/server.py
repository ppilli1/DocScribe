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
CORS(app, resources={r"/MD": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/OR": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})
api_key = os.getenv("OPENAI_API_KEY")
messages_red = []




@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files or 'paths' not in request.form:
        return 'No file part or path in the request', 400
    
    files = request.files.getlist('files')
    paths = request.form.getlist('paths')

    base_directory = './uploaded_files'

    for i in range(len(files)):
        file = files[i]
        relative_path = paths[i]
        
        # Create the full directory path
        full_path = os.path.join(base_directory, os.path.dirname(relative_path))

        if not os.path.exists(full_path):
            os.makedirs(full_path)

        # Save the file with its original filename in the correct folder
        file.save(os.path.join(full_path, file.filename))
        print(f'File {file.filename} uploaded successfully to {full_path}')
    
    
    
    return 'Files uploaded successfully', 200
    
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
    app.run(use_reloader=True, port=5173, threaded=True)