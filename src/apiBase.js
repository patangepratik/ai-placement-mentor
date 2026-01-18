const getBaseUrl = () => {
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    // Get environment variables baked in during build
    const envUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;

    // 1. If we are running locally, use localhost backend
    if (isLocalhost) {
        return 'http://localhost:5000';
    }

    // 2. If we are on production (Vercel/Netlify), but envUrl is localhost, 
    // it means it was accidentally baked in from a local .env file.
    // We should ignore it and use the real production URL.
    if (envUrl && !envUrl.includes('localhost')) {
        return envUrl;
    }

    // 3. Fallback to default Production Render URL
    return 'https://ai-placement-mentor-backend.onrender.com';
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
