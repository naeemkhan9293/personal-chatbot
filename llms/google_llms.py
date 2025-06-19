from langchain_google_genai import GoogleGenerativeAI
import os
from dotenv import load_dotenv
load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")


if not google_api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")

else:
    print(f"API key loaded: {google_api_key[:10]}...{google_api_key[-4:] if len(google_api_key) > 14 else google_api_key}")
    print(f"API key length: {len(google_api_key)}")

google_llm = GoogleGenerativeAI(model="gemini-2.0-flash")
