

export const transcribeAudio = async (audioFile) => {
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

export const postProcessTranscriptWithGPT = async (transcribedText) => {
    const promptInstructions = `
        You are a dental treatment planner assistant. Your role is to meticulously organize 
        dental procedures that I, a dentist, will be listing out. It's essential that you 
        understand these procedures might be presented in a continuous stream without clear 
        breaks, as they are transcribed from voice inputs. Your task is to discern individual 
        treatments, categorize them into 'Existing', 'Conditions', or 'Treatments', and ensure 
        each one is clearly separated and listed on a new line for clarity and organization.

        Categories are defined as:
        - 'Existing': These are pre-existing treatments or dental work already present.
        - 'Conditions': These are dental issues or conditions that need addressing.
        - 'Treatments': These are new treatments or procedures that will be applied.

        Pay close attention to cues such as numbering (e.g., '#1', '#2'), common dental 
        procedure terms (e.g., 'crown', 'extraction'), and any indication of a new procedure 
        starting.

        For example, if I say:
        'tooth number 5 MOD composite, number 6 extraction bone graft implant, number 7-9 veneers, upper left and lower right SRP',
        your response should be:
        {
          "Existing": [
            "#5 MOD composite"
          ],
          "Conditions": [
            "#6 extraction, bone graft, implant"
          ],
          "Treatments": [
            "#7-9 veneers",
            "upper left and lower right SRP"
          ]
        }

        Keep in mind that the procedure category SRP is a special case because the procedure 
        name includes digits at the end of it, not to be confused with tooth numbers.

        As another example, including an SRP category, I might say:
        'Number 3 MOD composite number 6 extraction bone graft implant number 12 root canal with post upper right and lower left SRP one to three',
        your response should be:
        {
          "Existing": [
            "#3 MOD composite"
          ],
          "Conditions": [
            "#6 extraction, bone graft, implant",
            "#12 root canal with post"
          ],
          "Treatments": [
            "upper right and lower left SRP 1-3"
          ]
        }

        As another example, I might say:
        'Number 5 existing MOD composite with recurrent decay in need of crown',
        your response should be:
        {
          "Existing": [
            "#5 MOD composite"
          ],
          "Conditions": [
            "#5 Recurrent decay"
          ],
          "Treatments": [
            "#5 Crown"
          ]
        }

        As another example, I might say:
        'Number 12 existing root canal with periapical abscess in need of root canal retreatment and crown',
        your response should be:
        {
          "Existing": [
            "#12 Root canal"
          ],
          "Conditions": [
            "#12 Periapical abscess"
          ],
          "Treatments": [
            "#12 Root canal retreatment",
            "#12 Crown"
          ]
        }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: promptInstructions },
                { role: "user", content: transcribedText }
            ]
        })
    });

    const data = await response.json();
    const categorizedText = JSON.parse(data.choices[0].message.content); 
    return categorizedText;
};

