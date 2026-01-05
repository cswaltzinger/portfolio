# Gemeni API

This repository is meant to be a bad replica of siri that uses the Google Gemeni API to transcribe and process requests by the user.  

To run this web application, simply serve this directory with your choice of http/https server.  The following was used for the development of this code base and is accessable on [localhost:8000](http://localhost:8000):
```bash 
$ python3 -m http.server 8000
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

## NOTE: 
API keys are not provided.  To use this application, you need to first obtian your own API key at [ this link ](aistudio.google.com) and create the file `api-key.js` with the following contents:
```javascript
const apiKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


async function fetchWithRetry(apiCall, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await apiCall();
            if (response.ok) {
                return response;
            }
            if (response.status === 429) { // Too Many Requests
                alert("Too Many Requests")
                return null;
                const delay = Math.pow(2, i) * 1000 + (Math.random() * 1000); // Exponential backoff + jitter
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw new Error(`API returned status ${response.status}: ${response.statusText}`);
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            const delay = Math.pow(2, i) * 1000 + (Math.random() * 1000); // Exponential backoff + jitter
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return null
}
```


