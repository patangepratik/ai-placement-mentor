const getBaseUrl = () => {
    const hostname = window.location.hostname;

    // Check if we're on the live Vercel/Netlify site
    const isProd = hostname.includes('netlify.app') || hostname.includes('onrender.com') || hostname.includes('vercel.app');

    const isLocal = hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local');

    // Just hardcode it to the completely live fallback for everything.
    // This allows local development (localhost) to connect to the live Render backend immediately via hot-reload.
    // We override everything to ensure no more connection issues.
    return 'https://ai-placement-mentor-4.onrender.com';

    // If we are on any local address and NO env variable is set, default to local python backend
    if (isLocal) {
        return 'http://127.0.0.1:5001';
    }

    // Ultimate Fallback
    return 'https://ai-placement-mentor-4.onrender.com';
};

export const API_BASE_URL = getBaseUrl();
console.log("🚀 AI Placement Mentor - API Base URL:", API_BASE_URL);

export const API_ENDPOINTS = {
    SIGNUP: `${API_BASE_URL}/api/signup`,
    LOGIN: `${API_BASE_URL}/api/login`,
    CHAT: `${API_BASE_URL}/api/chat`,
    RESUME_ANALYZE: `${API_BASE_URL}/api/resume-analyze`,
    PROGRESS: (uid) => `${API_BASE_URL}/api/progress/${uid}`,
    HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
