# 🚀 AI Placement Mentor - Redeployment Guide

To fix the "Failed to fetch" errors and get your app working perfectly on Netlify and Render, follow these steps:

## 1. Backend Redeploy (Render)
The backend now includes proper CORS settings and a health endpoint.

1.  **Commit and Push** your changes to GitHub:
    ```bash
    git add .
    git commit -m "Fix: Backend CORS and health check"
    git push origin main
    ```
2.  Go to your **Render Dashboard**.
3.  Select your `ai-placement-mentor-backend` service.
4.  Render should automatically detect the push and start a new deploy.
5.  **Important:** Note your backend URL (e.g., `https://your-app.onrender.com`).

## 2. Frontend Redeploy (Netlify)
The frontend now uses dynamic URL detection and better error handling.

1.  Go to your **Netlify Dashboard**.
2.  Select your project.
3.  Navigate to **Site Settings** > **Environment variables**.
4.  Add or Update the following variable:
    -   Key: `REACT_APP_API_URL`
    -   Value: `https://your-backend-url.onrender.com` (Your Render URL)
5.  Trigger a new deploy (or it will auto-deploy if connected to Git).

## 3. Environment Variable Verification
Ensure these variables are set on their respective platforms:

### Render (Backend)
-   `GEMINI_API_KEY`: Your Google Gemini API Key
-   `PORT`: 5000 (usually default on Render)

### Netlify (Frontend)
-   `REACT_APP_API_URL`: Your full Render backend URL
-   `REACT_APP_GEMINI_API_KEY`: Your Gemini API Key (for direct calls if needed)

## ✅ What's Fixed?
-   **No More "Failed to Fetch":** API calls now point to the deployed backend, not localhost.
-   **CORS Resolved:** The backend now explicitly allows `netlify.app` and `localhost`.
-   **Guest Mode:** Users can now click "Continue as Guest" to test the app without signing up.
-   **Retries:** If the backend is "sleeping" (Render free tier), the frontend will automatically retry up to 3 times.
-   **Health Check:** `GET /health` is now active for monitoring.
