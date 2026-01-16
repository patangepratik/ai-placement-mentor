import google.generativeai as genai
genai.configure(api_key="AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")
model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("Say hello")
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Error: {e}")
