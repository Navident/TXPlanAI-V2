import { instructions } from './config/promptInstructions.js';
import { examples } from './config/examples.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
  const MODEL_NAME = "gemini-pro";
const API_KEY = 'AIzaSyD6-3VH8buIFHbnoqY8SLOilzHtarGR9nU';

export async function runGeminiPro(userInput) {
    let generatedText = ''; 
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const parts = [
            instructions,
            ...examples,
            { text: `input: ${userInput}` },
            { text: "output: " },
        ];
        console.log("Parts for generation:", parts);

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
        console.log("Raw generation result:", result);

        generatedText = await result.response.text();
        console.log("Generated text:", generatedText);
    } catch (error) {
        console.error("Error during content generation:", error);
        generatedText = "An error occurred while generating content.";
    }

    return generatedText;
}
  
 