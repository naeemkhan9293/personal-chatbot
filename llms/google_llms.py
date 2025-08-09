from langchain_google_genai import GoogleGenerativeAI, ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the API key
google_api_key = os.getenv("GOOGLE_API_KEY")

if not google_api_key:
    raise ValueError(
        "GOOGLE_API_KEY not found in environment variables. Please check your .env file.")
else:
    print(
        f"API key loaded: {google_api_key[:10]}...{google_api_key[-4:] if len(google_api_key) > 14 else google_api_key}")
    print(f"API key length: {len(google_api_key)}")

# Initialize the standard Google Generative AI model
google_llm = GoogleGenerativeAI(model="gemini-1.5-flash")

google_llm_imagen = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-preview-image-generation",
    client_options={
        "api_endpoint": "generativelanguage.googleapis.com"
    }
)