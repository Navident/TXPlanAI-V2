export const API_CONFIG = {
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    defaultParams: {
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    }
};
