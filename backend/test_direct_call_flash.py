import requests
import json

key = "AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
data = {"contents": [{"parts": [{"text": "Hello"}]}]}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
