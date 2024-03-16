import { API_CONFIG } from './Config/apiConfig'; 
import instructions from './Config/instructions.json';
import examples from './Config/examples.json';

export async function fetchOpenAIResponse(userQuery) {
    const body = JSON.stringify({
        ...API_CONFIG.defaultParams,
        model: API_CONFIG.model,
        messages: [{ "role": "system", "content": instructions.content }, ...examples, { "role": "user", "content": userQuery }]
    });
    console.log("Headers being sent:", API_CONFIG.headers);

    const response = await fetch(API_CONFIG.endpoint, { method: "POST", headers: API_CONFIG.headers, body });

    if (!response.ok) throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);

    const data = await response.json();
    return data.choices[0].message.content; 
}



