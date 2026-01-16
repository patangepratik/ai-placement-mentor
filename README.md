# AI Placement Mentor 🚀

A production-ready, professional web application designed to help students master their placement preparation using Google Gemini AI.

## ✨ Features

- **🔐 Robust Auth System**: Secure Login/Signup with persistent session management and mock Firebase integration.
- **📊 AI Resume Intel**: Upload your PDF resume and get a 100-point ATS score, keyword gap analysis, and a personalized career roadmap.
- **💬 Smart AI Assistant**: A Gemini 1.5 Flash-powered chatbot that handles coding doubts, HR questions, and career guidance.
- **📝 Practice Modules**:
  - **Aptitude**: Quantitative, Logical, and Verbal reasoning tests with instant explanations.
  - **Programming**: DSA-focused problem sets from Easy to Hard with complexity analysis.
  - **Interview**: A curated library of HR and Technical questions with expert-suggested answers.
- **🌙 Modern UI**: Google-style clean layout with full Dark Mode support, mobile-first responsiveness, and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React 19, Material UI (MUI), Framer Motion, Axios, React Router 6.
- **Backend**: Python Flask, Google GenAI SDK, PyPDF2.
- **AI Engine**: Google Gemini 1.5 Flash.

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Make sure to have your `GEMINI_API_KEY` in the `.env` file.*

### 2. Frontend Setup
```bash
npm install
npm start
```

## 🌐 Deployment
This project is configured for one-click deployment to **Vercel** (Frontend) and any Python-hosting service (Backend).

---
Built with ❤️ for the next generation of Engineers.
