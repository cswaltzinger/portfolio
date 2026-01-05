

/**
 * Queries the Google Gemini API with a user prompt and displays the response 
 * (formatted as basic HTML) in a target DIV element.
 * * @param {string} userPrompt - The text prompt/query to send to the model.
 * @param {HTMLElement} divElement - The DOM element where the response should be displayed.
 * @returns {void}
 */
async function AskGeminiV1(userPrompt, divElement) {
    if (!userPrompt || !divElement) {
        console.error("AskGemini requires a prompt and a target div element.");
        return;
    }

    // Set a visual loading indicator
    divElement.innerHTML = `<div class="text-blue-500 font-semibold animate-pulse p-4">
        <svg class="animate-spin inline-block w-4 h-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full" viewBox="0 0 24 24"></svg>
        Generating response...
    </div>`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            // Instruct the model to format output using markdown for clean display
            systemInstruction: {
                parts: [{ text: "You are a helpful assistant. Format your response clearly using markdown." }]
            },
        };

        const apiCall = () => fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const response = await fetchWithRetry(apiCall);
        const result = await response.json();
        
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(result)
        if (generatedText) {
            // Simple HTML formatting for markdown: BOLD, ITALIC, and Newlines
            let htmlContent = generatedText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^- (.*)/gm, '<li>$1</li>') // Simple list item conversion
                .replace(/\n/g, '<br>');

            // Wrap list items in <ul> for better structure if lists were present
            htmlContent = htmlContent.replace(/<br><li>/g, '<li>').replace(/<\/li><br>/g, '</li>');
            if (htmlContent.includes('<li>')) {
                 htmlContent = '<ul>' + htmlContent + '</ul>';
            }


            divElement.innerHTML = htmlContent;

        } else {
            divElement.innerHTML = `<div class="text-red-500 p-4">Error: Could not retrieve a valid response from the API.</div>`;
            console.error("API response error:", result);
        }

    } catch (error) {
        console.error('Gemini API Query Error:', error);
        divElement.innerHTML = `<div class="text-red-500 p-4">Request failed: ${error.message}</div>`;
    }
}

async function AskGemini(userPrompt, divElement) {
    if (!userPrompt || !divElement) {
        console.error("AskGemini requires a prompt and a target div element.");
        return;
    }

    // Set a visual loading indicator
    divElement.innerHTML = `<div class="text-blue-500 font-semibold animate-pulse p-4">
        <svg class="animate-spin inline-block w-4 h-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full" viewBox="0 0 24 24"></svg>
        Generating response...
    </div>`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            // Instruct the model to format output as raw HTML
            systemInstruction: {
                parts: [
                    { text: "You are a helpful assistant. Provide the response formatted entirely as raw HTML (including appropriate tags like <p>, <ul>, <strong>, etc.) without any introductory or concluding markdown/text outside of the HTML structure." },
                    { text: "You are a helpful assistant. Please make the raw html response pretty by including colored syntax hilighting for any code produiced.  thank you.  " }

                ]
            },
        };

        const apiCall = () => fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        const response = await fetchWithRetry(apiCall);
        const result = await response.json();
        
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
            // Since the system instruction requests raw HTML, we insert the text directly.
            divElement.innerHTML = generatedText;

        } else {
            divElement.innerHTML = `<div class="text-red-500 p-4">Error: Could not retrieve a valid response from the API.</div>`;
            console.error("API response error:", result);
        }

    } catch (error) {
        console.error('Gemini API Query Error:', error);
        divElement.innerHTML = `<div class="text-red-500 p-4">Request failed: ${error.message}</div>`;
    }
}
