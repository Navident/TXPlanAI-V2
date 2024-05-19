

export const transcribeAudio = async (audioFile) => {
    console.log("audioFile details:", audioFile, typeof audioFile);

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: formData
        });
        const data = await response.json();
        console.log("Full Response:", data);
        return data.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return null;
    }
};

export const postProcessTranscriptWithGPT = async (transcribedText, prompt) => {
    console.log("prompt being used right now: ", prompt);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: transcribedText }
            ]
        })
    });

    const data = await response.json();
    console.log("response after processing:", data);

    // Check if the response has choices and the first choice has content
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const content = data.choices[0].message.content;

        // Attempt to parse the content as JSON
        try {
            const parsedContent = JSON.parse(content);
            console.log("Parsed content:", parsedContent);
            return parsedContent;
        } catch (e) {
            // If parsing fails, return the content as plain text
            console.log("Content is plain text:", content);
            return content;
        }
    } else {
        console.error("No choices available or invalid response structure:", data);
        return null;
    }
};

