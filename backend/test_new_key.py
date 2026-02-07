from google import genai
import os

client = genai.Client(api_key="AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")

try:
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Say hello"
    )
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Error: {e}")
