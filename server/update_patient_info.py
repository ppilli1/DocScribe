from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_models import ChatOpenAI
import os
from dotenv import load_dotenv 
from extractDoc import patient_data
import ast

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# extract full transcript
transcript_path = './assets/MD_full.txt'
with open(transcript_path, 'r') as file:
    text_content = file.read()

# initialize prompts
patient_data_and_transcript_analysis = [HumanMessage(content = "Analyze the full transcript of an encounter between a doctor and a patient, as well as the initial patient data (patient intake form), you should not respond to this.")]
patient_data_and_transcript_analysis.append(HumanMessage(content = f"Here's the patient intial data (patient intake form): {patient_data}. Do not respond to this message, only analyze."))
patient_data_and_transcript_analysis.append(HumanMessage(content = f"Here's the transcript of the whole patient and doctor encounter: {text_content}. Do not respond to this message, only analyze."))

def get_updated_patient_info():
    """Takes each factor and """
    chat_model = ChatOpenAI(openai_api_key=api_key)
    # patient_data_and_transcript_analysis.append(HumanMessage(content=f"Now, after analyzing the transcript and the initial patient data (patient intake form), return updated patient data, in the same format as the initial patient data that was sent, but with updated information coming from the transcript. Only add new values if the fields were already in the initial patient info. For example: if vaccinations were in the initial patient data and we have new vaccination data, you can add the new information. However, if there's new data about a field that was not previously in the initial patient data, do not add it. ) Return all the data that was present in the initial report with additional data only on existing fields. Return it in a format which makes it easy to convert into a PDF")) 
    patient_data_and_transcript_analysis.append(HumanMessage(content=f"""Now, after analyzing the transcript and the initial patient data (patient intake form), update the patient data (patient intake form) using the following guidelines:
        1. Return **all original data** from the initial patient intake form exactly as it was provided.
        2. Only **update or add new information** to fields that already exist in the initial patient intake form.
            - For example, if the transcript contains new information for medications or allergies, you may update or append the new data to the relevant section.
            - However, if there is new data from the transcript for a field that is not present in the initial patient data (e.g., new types of information such as family history that was not in the original form), **do not add that field**.
        3. Convert the new data in a python 3D array format (each header [which is denoted by text between **NAME**] should have it's own 2D array), for example:
            [[["**Patient Information**", ""],
            ["Full Name", "John Doe"],
            ["Date", "04/23/1985"],
            ["Birth Date", "04/23/1985"],
            ["Age", "39"]],
                                                             
            [["**Allergies**", ""],
            ["Allergy", "Penicillin, Allergic Reaction: Rash, Swelling"],
            ["Allergy", "Pollen, Allergic Reactions: Sneezing, Itchy Eyes"]]]
        4. If no new information is available for a specific field, leave that field unchanged.
    """)) 
    result = chat_model.predict_messages(patient_data_and_transcript_analysis)
    write_content = result.content
    return write_content

new_pdf_data = get_updated_patient_info()
new_pdf_data = new_pdf_data.replace("```python", "")
new_pdf_data = new_pdf_data.replace("```", '').strip()
new_pdf_data = ast.literal_eval(new_pdf_data)



def ratingz():
    for factor in factors:
        rating = rate_transcript(factor, ratings)
        ratings.append(rating)
    final_rating = sum(ratings) / len(ratings)
    return final_rating