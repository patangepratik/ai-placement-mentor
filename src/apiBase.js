const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    // Get environment variables baked in during build
    const envUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;

    // If we have a valid environment variable, use it everywhere
    if (envUrl && !envUrl.includes('localhost')) {
        return envUrl;
    }

    // Default Live Backend URL (Your Render URL)
    const liveUrl = 'https://ai-placement-mentor-snau.onrender.com';

    // If we are on production, always return the live URL
    if (!isLocalhost) {
        return liveUrl;
    }

    // If we are on localhost, we'll try to use the live URL by default 
    // so you don't have to run Python locally. 
    // If you WANT to use your local Python backend, change this to 'http://localhost:5000'
    return liveUrl;
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
