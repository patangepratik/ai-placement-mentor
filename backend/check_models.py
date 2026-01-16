from google import genai
import os

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")

def list_with_version(ver):
    print(f"\n--- Testing API Version: {ver} ---")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY, http_options={'api_version': ver})
        models = client.models.list()
        for m in models:
            print(f"[{ver}] Model: {m.name}")
    except Exception as e:
        print(f"[{ver}] Error: {e}")

list_with_version('v1')
list_with_version('v1beta')
