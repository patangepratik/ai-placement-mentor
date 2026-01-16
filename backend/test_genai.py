from google import genai
import os

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")
client = genai.Client(api_key=GEMINI_API_KEY)

try:
    print("Testing gemini-1.5-flash...")
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents="Hello"
    )
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Flash Failed: {e}")
    try:
        print("Testing gemini-pro...")
        response = client.models.generate_content(
            model='gemini-pro',
            contents="Hello"
        )
        print(f"Pro Success! Response: {response.text}")
    except Exception as e2:
        print(f"Pro Failed: {e2}")
