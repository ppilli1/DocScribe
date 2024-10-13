import requests
import fitz  # PyMuPDF
import os
from dotenv import load_dotenv 

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")



def metadata():
    pdf_document = "./uploaded_files/filled_doc.pdf"  # SWITCH FOR PDF THAT WAS ENTERED IN THE FRONTEND
    document = fitz.open(pdf_document)

    all_text = ""
    # Extract text from each page
    for page_num in range(document.page_count):
        page = document.load_page(page_num)  # Load page
        text = page.get_text()  # Extract text
        all_text += f"{text}\n"

    # Close the document when done
    document.close()
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "can you analyze each page of the document. Each form, and transcribe it and then convert to a json? Return the json only"},
            {"role": "user", "content": all_text}
        ],
        "temperature": 0
    }

    response = requests.post(url, headers=headers, json=data)

    # Safely handle missing keys
    response_json = response.json()
    if 'choices' in response_json:
        json = response_json['choices'][0]['message']['content']
        cleaned_json = json.strip('```json').strip('```').strip()
        with open('./uploaded_files/document_data.json', 'a') as file:
            file.write(cleaned_json)
            file.write("\n")
        return cleaned_json
    else:
        print(f"Error: 'choices' not found in the response: {response_json}")
        return "Error: Unable to retrieve metadata"
    

if __name__ == "__main__":
    metadata()