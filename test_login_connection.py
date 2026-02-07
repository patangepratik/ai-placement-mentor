import urllib.request
import json
import urllib.error

data = json.dumps({'email':'maske@gmail.com', 'password':'abc'}).encode('utf-8')
req = urllib.request.Request('http://localhost:5000/api/login', data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    print("Attempting to connect to backend...")
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Backend Responded with Error:", e.read().decode('utf-8'))
except Exception as e:
    print("Connection Failed:", str(e))
