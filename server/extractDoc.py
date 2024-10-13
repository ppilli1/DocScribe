import requests
import fitz  # PyMuPDF
import os
from dotenv import load_dotenv 

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Open the PDF file
def extract_text_from_pdf(pdf_doc_path):
    document = fitz.open(pdf_doc_path)

    all_text = ""
    # Extract text from each page
    for page_num in range(document.page_count):
        page = document.load_page(page_num)  # Load page
        text = page.get_text()  # Extract text
        all_text += f"{text}\n"

    # Close the document when done
    document.close()
    return all_text

def transcribe_and_organize_patient_data(pdf_doc_path : str):
    """Reads document and sends JSON"""
    doc_in_str = extract_text_from_pdf(pdf_doc_path)
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "can you analyze each page of the document. Each form, and transcribe it and then write it in an organized way in which can be read as a string? (example: Patient's allergies: Pollen, Penicillin. Patient's medications: Ibuprofen, Metmorfin). Leave empty fields empty"},
            {"role": "user", "content": doc_in_str}
        ],
        "temperature": 0
    }

    response = requests.post(url, headers=headers, json=data)

    # Safely handle missing keys
    response_json = response.json()
    if 'choices' in response_json:
        data = response_json['choices'][0]['message']['content']
        return data
    else:
        print(f"Error: 'choices' not found in the response: {response_json}")

patient_data = transcribe_and_organize_patient_data("./uploaded_files/filled_doc.pdf")
patient_data = patient_data if patient_data is not None else ""
