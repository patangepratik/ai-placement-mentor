import google.generativeai as genai
import os

# Using the key from DEPLOYMENT.md
genai.configure(api_key="AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")

try:
    print("Listing models with old SDK...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Testing generate_content with gemini-1.5-flash...")
    response = model.generate_content("Say hello")
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Error: {e}")
