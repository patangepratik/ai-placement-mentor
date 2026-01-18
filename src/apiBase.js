const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    // 1. If we are running on Vercel/Production, we should NEVER use localhost.
    if (!isLocalhost) {
        // Try environment variable first (should be set in Vercel settings)
        const envUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;

        if (envUrl && !envUrl.includes('localhost')) {
            return envUrl;
        }

        // FALLBACK: Use the URL found in your Render screenshot
        // Note: Your current Render service 'ai-placement-mentor' seems to be a Static Site.
        // It MUST be a "Web Service" to run the Python code.
        return 'https://ai-placement-mentor-dmsa.onrender.com';
    }

    // 2. If we are running locally (localhost:3000), use the local backend
    return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
export const API_ENDPOINTS = {
    SIGNUP: `${API_BASE_URL}/api/signup`,
    LOGIN: `${API_BASE_URL}/api/login`,
    CHAT: `${API_BASE_URL}/api/chat`,
    RESUME_ANALYZE: `${API_BASE_URL}/api/resume-analyze`,
    PROGRESS: (uid) => `${API_BASE_URL}/api/progress/${uid}`,
    HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
