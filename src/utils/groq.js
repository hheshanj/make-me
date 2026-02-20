/**
 * Utility to interact with the Groq API
 *
 * @param {string} prompt - The user's prompt or content to process
 * @param {string} apiKey - The user's Groq API Key (starts with `gsk_`)
 * @param {string} model - The model to use (default: llama3-8b-8192)
 * @returns {Promise<string>} The generated text
 */
export async function generateContent(prompt, apiKey, model = 'openai/gpt-oss-120b') {
    if (!apiKey) {
        throw new Error('API Key is missing');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant for a markdown editor. You help users improve their writing, fix grammar, and generate content. Output ONLY the requested markdown content without conversational filler unless explicitly asked. Do NOT wrap code in markdown blocks unless requested.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: model,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}
