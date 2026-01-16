# AI Placement Mentor - Deployment Guide

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)

---

## Step 1: Push to GitHub

```bash
cd "c:\Users\Ashish\Downloads\new project\ai-placement-mentor"
git init
git add .
git commit -m "Initial commit - AI Placement Mentor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-placement-mentor.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** ai-placement-mentor-backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Root Directory:** `backend`

5. Add Environment Variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w`

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://ai-placement-mentor-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variables:
   - **REACT_APP_GEMINI_API_KEY:** `AIzaSyBORjxRqbiE1byX5hOyFAUXoSZvnBh7z8w`
   - **REACT_APP_BACKEND_URL:** `https://your-backend-url.onrender.com` (from Step 2)

6. Click "Deploy"
7. Wait 2-3 minutes

---

## Step 4: Test Your Deployed App

1. Visit your Vercel URL (e.g., `https://ai-placement-mentor.vercel.app`)
2. Test:
   - ✅ Login (Google/GitHub/Email)
   - ✅ Dashboard loads
   - ✅ AI Assistant responds
   - ✅ Resume Analyzer works
   - ✅ Practice modules load

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Next Steps:**
1. Update README with live demo link
2. Take screenshots of deployed app
3. Post on LinkedIn
4. Share on GitHub

---

## 🔧 Troubleshooting

**Backend takes 30+ seconds to respond?**
- Render free tier sleeps after inactivity
- First request wakes it up (normal behavior)

**CORS Error?**
- Update `backend/app.py`:
```python
CORS(app, origins=["https://your-vercel-app.vercel.app"])
```
- Redeploy backend

**Environment variables not working?**
- Check spelling (case-sensitive)
- Redeploy after adding variables
- Check Vercel/Render logs

---

## 📱 Custom Domain (Optional)

1. Buy domain from Namecheap/GoDaddy
2. In Vercel: Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Wait 24-48 hours for propagation

---

**Deployment Time:** ~30 minutes
**Cost:** $0 (Free tier)
