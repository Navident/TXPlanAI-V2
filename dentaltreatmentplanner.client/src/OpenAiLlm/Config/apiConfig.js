export const API_CONFIG = {
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "ft:gpt-3.5-turbo-0125:personal:playground-data:91MAKlHq",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
    },
    defaultParams: {
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    }
};
