import google.generativeai as genai
key = "AIzaSyDdDivL6ZM3tlvwrpmnh74V_Ld6V1PwSss"
genai.configure(api_key=key)
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello")
    print(f"Key Result: {response.text}")
except Exception as e:
    print(f"Key Failure: {e}")
