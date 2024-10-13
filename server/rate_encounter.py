from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_models import ChatOpenAI
import os
from dotenv import load_dotenv 

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# extract full transcript
transcript_path = './assets/MD_full.txt'
with open(transcript_path, 'r') as file:
    text_content = file.read()

transcript_analysis = [HumanMessage(content = "Analyze the following transcript of a doctor-patient encounter and rate the doctor's performance on a scale of 0 to 100 based on specific factors I will provide. I will send one factor at a time, and you will give a rating based on that individual factor. Do not provide any overall feedback or commentary yet; just return the rating for each factor as it is sent. Remember to only return a number as a score.")]
transcript_analysis.append(HumanMessage(content = "This is the transcript: " + str(text_content) + ". Remember to not respond to this message and for every factor following this, just return a score number."))

# list of factors that the doctor is being rated on
factors = [
    "Listen actively to the patient’s concerns without interruption, showing empathy and validating their feelings.",
    "Ask open-ended questions to encourage the patient to describe symptoms in detail (e.g., 'Can you tell me more about your pain?').",
    "Clarify and confirm understanding by summarizing what the patient has shared to avoid miscommunication.",
    "Conduct a thorough history review, asking about the duration, severity, and factors affecting symptoms, as well as medical history and lifestyle.",
    "Explain medical information clearly, avoiding jargon, and ensuring the patient understands the diagnosis and treatment options.",
    "Show empathy and reassurance when discussing difficult news, treatment options, or potential outcomes.",
    "Tailor the treatment plan to the patient’s individual needs and preferences, offering alternative options when available.",
    "Encourage patient questions, making space for them to express concerns or seek clarification.",
    "Provide clear follow-up instructions, ensuring the patient knows what steps to take next and when to return for monitoring.",
    "Build trust and rapport by making the patient feel supported, cared for, and involved in their healthcare decisions."
]

# ratings for each individual factor will be appended to the list
ratings = []

def rate_transcript(factor):
    """Takes each factor and """
    chat_model = ChatOpenAI(openai_api_key=api_key)
    transcript_analysis.append(HumanMessage(content=f"Rate the transcript given before based on the following factor, please rate it from 0 to 100 and make sure to return only a number. factor: {factor}")) 
    result = chat_model.predict_messages(transcript_analysis)
    write_content = result.content
    return int(write_content)

# Iterate through each factor and rate the transcript based on each one
for factor in factors:
    rating = rate_transcript(factor, ratings)
    ratings.append(rating)

# uses average to get a final rating
final_rating = sum(ratings) / len(ratings)

