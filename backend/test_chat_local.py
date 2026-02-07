import requests

url = "http://localhost:5000/api/chat"
payload = {"message": "Hello, how are you?"}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
