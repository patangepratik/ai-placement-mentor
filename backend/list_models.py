import google.generativeai as genai
genai.configure(api_key="AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w")
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)
