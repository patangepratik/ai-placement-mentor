const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function askGemini(prompt) {
    console.log("API Key exists:", !!API_KEY);
    console.log("Sending prompt to Gemini:", prompt);

    if (!API_KEY) {
        return "⚠️ API Key not found. Please restart the React server (npm start) after adding the .env file.";
    }

    try {
        // Using the stable v1beta API with gemini-pro model
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);

        if (data.error) {
            console.error("API Error:", data.error);
            return `❌ API Error: ${data.error.message}. The API key might be invalid or expired.`;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.error("No text in response:", data);
            return "I received a response but couldn't extract the text. Please try again.";
        }

        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `⚠️ Connection error: ${error.message}. Please check your internet connection and API key.`;
    }
}
