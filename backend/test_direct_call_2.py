import requests
import json

key = "AIzaSyBaExqXrKw0ujdfZL9hT5-WluBGaSYQKSs"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={key}"
data = {"contents": [{"parts": [{"text": "Hello"}]}]}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
