import axios from 'axios';
import API_BASE_URL from '../apiBase';

const BACKEND_URL = API_BASE_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class AIService {
    constructor() {
        this.isBackendOnline = false;
        this.checkInterval = null;
        this.checkHealth();
        this.startHealthCheck();
    }

    startHealthCheck() {
        if (this.checkInterval) clearInterval(this.checkInterval);
        this.checkInterval = setInterval(() => this.checkHealth(), 30000); // Check every 30s
    }

    async checkHealth() {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 2000 });
            this.isBackendOnline = response.status === 200;
        } catch (error) {
            this.isBackendOnline = false;
        }
        return this.isBackendOnline;
    }

    async retryRequest(fn, retries = MAX_RETRIES) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return this.retryRequest(fn, retries - 1);
            }
            throw error;
        }
    }

    async chat(message) {
        const fetchRemote = async () => {
            const response = await axios.post(`${BACKEND_URL}/api/chat`, { message });
            return response.data.reply;
        };

        try {
            if (!this.isBackendOnline) {
                const online = await this.checkHealth();
                if (!online) throw new Error("Offline");
            }
            return await this.retryRequest(fetchRemote);
        } catch (error) {
            console.warn("AI Backend Offline, using fallback responses.");
            return this.getFallbackReply(message);
        }
    }

    async analyzeResume(file) {
        const formData = new FormData();
        formData.append('resume', file);

        const fetchRemote = async () => {
            const response = await axios.post(`${BACKEND_URL}/api/resume-analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        };

        try {
            return await this.retryRequest(fetchRemote);
        } catch (error) {
            console.error("Resume Analysis Detail:", error);
            if (error.response) {
                // Server responded with an error (e.g. 500 AI Engine failure)
                throw new Error(`AI Engine Error: ${error.response.data.error || "Processing failed"}. Please try again later.`);
            }
            throw new Error(`Cannot connect to AI Server. Please ensure the backend is running at ${BACKEND_URL}`);

        }
    }

    getFallbackReply(message) {
        const msg = message.toLowerCase();
        if (msg.includes('interview')) return "Preparing for interviews? Focus on 'Tell me about yourself', your projects, and core CS fundamentals like OOPS and DBMS.";
        if (msg.includes('coding') || msg.includes('programming')) return "Practice makes perfect! Try solving at least 2 coding problems daily on platforms like LeetCode or our Programming module.";
        if (msg.includes('resume')) return "Tailor your resume for each job. Use action verbs and quantify your achievements (e.g., 'Improved performance by 20%').";
        return "I'm currently in offline mode, but I can still give you general placement advice. Ask me about interviews, coding, or resumes!";
    }
}

const aiService = new AIService();
export default aiService;
