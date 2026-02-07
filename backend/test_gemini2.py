from google import genai
import os

client = genai.Client(api_key="AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")

try:
    print("Testing gemini-2.0-flash...")
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents="Hello"
    )
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Failed: {e}")
