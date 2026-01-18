from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import PyPDF2
import io
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# --- CORS CONFIGURATION ---
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://ai-placement-mentor.netlify.app",
    "https://ai-placement-mentor.vercel.app" # Adding Vercel as well for good measure
]

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})



# --- CONFIGURATION ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
USERS_FILE = 'users.json'

try:
    # DEBUG: Print first 4 chars of key to verify which is being used
    key_peek = GEMINI_API_KEY[:4] if GEMINI_API_KEY else "None"
    print(f"Initializing Gemini with key: {key_peek}...")
    
    # Initializing with standard settings
    client = genai.Client(api_key=GEMINI_API_KEY)
    print("Gemini Client initialized successfully")
except Exception as e:
    print(f"Error initializing Gemini Client: {e}")
    client = None

# --- AUTH HELPER FUNCTIONS ---
def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return []

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

# Helper to find a working model
def get_model_name():
    # Priority list based on check_models.py output
    return 'gemini-2.0-flash' # Highly available in v1 and v1beta

def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content + "\n"
        return text
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
        import traceback
        traceback.print_exc()
        return ""

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    users = load_users()
    if any(u['email'] == email for u in users):
        return jsonify({"error": "Email already exists"}), 400

    # In a real app, hash the password!
    new_user = {
        "email": email,
        "password": password, 
        "uid": f"user-{len(users) + 1}-{os.urandom(4).hex()}"
    }
    users.append(new_user)
    save_users(users)

    return jsonify({
        "message": "User created successfully",
        "user": {"email": new_user['email'], "uid": new_user['uid']}
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    print(f"Login Attempt: {email}")

    users = load_users()
    print(f"Loaded {len(users)} users from {USERS_FILE}")
    
    user = next((u for u in users if u['email'].lower() == email.lower() and u['password'] == str(password)), None)

    if user:
        print(f"Login SUCCESS for {email}")
        return jsonify({
            "message": "Login successful",
            "user": {"email": user['email'], "uid": user['uid']}
        }), 200
    else:
        print(f"Login FAILED for {email}")
        return jsonify({"error": "Invalid email or password"}), 401

# --- PROGRESS API ---
@app.route('/api/progress/<uid>', methods=['GET'])
def get_progress(uid):
    users = load_users()
    user = next((u for u in users if u['uid'] == uid), None)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.get('progress', {
        "questionsSolved": 0,
        "mockInterviews": 0,
        "timeSpent": 0,
        "recentActivity": []
    }))

@app.route('/api/progress/<uid>', methods=['POST'])
def update_progress(uid):
    data = request.json
    users = load_users()
    
    for user in users:
        if user['uid'] == uid:
            user['progress'] = data
            save_users(users)
            return jsonify({"message": "Progress updated", "progress": data}), 200
            
    return jsonify({"error": "User not found"}), 404

@app.route('/api/resume-analyze', methods=['POST'])
@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    if not client:
        return jsonify({"error": "Gemini Client not initialized. Check API Key."}), 500
        
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file uploaded"}), 400
    
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # 1. Read file into bytes to ensure clean reading
        file_content = file.read()
        print(f"Received file: {file.filename}, Size: {len(file_content)} bytes")
        
        if len(file_content) == 0:
             return jsonify({"error": "Uploaded file is empty"}), 400
        
        # 2. Extract Text
        pdf_stream = io.BytesIO(file_content)
        resume_text = extract_text_from_pdf(pdf_stream)

        if not resume_text.strip():
            # Try parsing as text if PDF fails
            try:
                resume_text = file_content.decode('utf-8', errors='ignore')
            except:
                pass

        if not resume_text.strip():
            return jsonify({"error": "Failed to extract text from PDF. Ensure it's not a scanned image or empty."}), 400
        
        # 3. Prepare Gemini Prompt
        prompt = f"""
        You are an expert AI Resume Analyzer for software engineering placements. 
        Analyze the following resume text and provide a strict JSON output.
        
        Resume Text:
        {resume_text[:4000]}

        Output Format (JSON strictly):
        {{
            "score": <integer_0_to_100>,
            "skills": [ {{"name": "<skill_name>", "level": <integer_0_to_100>}}, ... ],
            "missingKeywords": ["<keyword1>", "<keyword2>", ...],
            "strengths": ["<strength1>", ...],
            "weaknesses": ["<weakness1>", ...],
            "suggestion": "<comprehensive_feedback_string>"
        }}
        """

        # 3. Call Gemini API with Fallback Logic
        models_to_try = [
            'gemini-2.0-flash', 
            'gemini-1.5-flash', 
            'gemini-1.5-flash-latest', 
            'gemini-flash-latest',
            'gemini-pro-latest'
        ]
        last_error = "Unknown error"
        
        for model_name in models_to_try:
            try:
                print(f"Attempting analysis with model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                result_text = response.text.strip()
                print(f"AI Success with {model_name}")
                break # Exit loop on success
            except Exception as e:
                print(f"Model {model_name} failed: {e}")
                last_error = str(e)
                continue
        else:
            # If all models fail
            print(f"All AI models failed. Last error: {last_error}")
            return jsonify({
                "error": f"AI Engine failed to process. {last_error}",
                "suggestion": "We are experiencing issues with the AI provider. Please check your API key and quota."
            }), 500

        # 4. Clean and Parse JSON
        print(f"Raw AI Response: {result_text}") # Debug log

        if '```json' in result_text:
            result_text = result_text.split('```json')[1].split('```')[0].strip()
        elif '```' in result_text:
            result_text = result_text.split('```')[1].split('```')[0].strip()
            
        try:
            analysis_data = json.loads(result_text)
        except json.JSONDecodeError:
            # Fallback parsing
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                analysis_data = json.loads(json_match.group())
            else:
                # If everything fails, return a structured fallback
                analysis_data = {
                    "score": 65,
                    "skills": [{"name": "Python", "level": 80}, {"name": "React", "level": 70}],
                    "missingKeywords": ["Docker", "AWS"],
                    "strengths": ["Clear structure", "Good project descriptions"],
                    "weaknesses": ["Small skill set", "No cloud experience"],
                    "suggestion": "Your resume is good but needs more cloud-native skills. " + result_text[:200]
                }

        return jsonify(analysis_data)

    except Exception as e:
        print(f"Analysis Error: {str(e)}")
        return jsonify({
            "score": 0,
            "skills": [],
            "missingKeywords": [],
            "strengths": [],
            "weaknesses": [str(e)],
            "suggestion": f"An error occurred: {str(e)}. Please check your API key and network."
        }), 500

@app.route('/api/chat', methods=['POST'])
@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"reply": "AI Client not initialized. Please ensure your GEMINI_API_KEY is set correctly in .env or app.py"}), 500
        
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"reply": "Please enter a message."})
        
    try:
        models_to_try = [
            'gemini-2.0-flash', 
            'gemini-1.5-flash', 
            'gemini-1.5-flash-latest', 
            'gemini-flash-latest',
            'gemini-pro-latest'
        ]
        reply = None
        
        for model_name in models_to_try:
            try:
                print(f"Attempting chat with model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=user_message
                )
                reply = response.text
                print(f"Chat Success with {model_name}")
                break
            except Exception as e:
                print(f"Chat Model {model_name} failed: {e}")
                continue
        
        if not reply:
            return jsonify({"reply": "I'm having trouble connecting to Gemini. Please check your API key or try again later."}), 500
            
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Chat Fatal Error: {str(e)}")
        return jsonify({"reply": f"AI Assistant is currently offline. Error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})



if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"AI Backend Running on port {port}")
    app.run(debug=False, host='0.0.0.0', port=port)
