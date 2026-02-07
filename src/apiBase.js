const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local');

    // Get environment variables baked in during build
    const envUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;

    // Use environment variable if it specifically points to a remote server
    if (envUrl && !envUrl.includes('localhost') && !isLocal) {
        return envUrl;
    }

    // If we are on any local address, prioritize the local Python backend
    if (isLocal) {
        return 'http://localhost:5000';
    }

    // Default Live Backend URL (Your Render URL)
    return 'https://ai-placement-mentor-snau.onrender.com';
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
