from google import genai
import os

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")
client = genai.Client(api_key=GEMINI_API_KEY)

print("Listing models...")
try:
    models = client.models.list()
    for m in models:
        print(f"Model ID: {m.name} | Supported methods: {m.supported_methods}")
except Exception as e:
    print(f"Error: {e}")
