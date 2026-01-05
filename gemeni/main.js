

const MONITOR_INTERVAL = 100; 
const SILENCE_THRESHOLD = 15; 
const SILENCE_DURATION = 3000; 


// --- State Variables ---
let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;
let monitoringIntervalId;
let silentTime = 0;
let isRecording = false;
let stream 
navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => {
        stream = s;

    }).catch(e => {
        console.error("Error accessing microphone:", e);
    });



// --- DOM Elements ---
const recordButton = document.getElementById('record-button');
const statusDisplay = document.getElementById('status-display');
const transcriptionOutput = document.getElementById('transcription-output');
const micIcon = document.getElementById('mic-icon');
const loadingSpinner = document.getElementById('loading-spinner');
const statusMessage = statusDisplay

// --- Utility Functions ---

function calculateRMS(dataArray) {
    let sumOfSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
        // Normalize the byte data to float range (-1.0 to 1.0) for RMS calculation
        const normalizedValue = dataArray[i] / 128.0 - 1.0; 
        sumOfSquares += normalizedValue * normalizedValue;
    }
    return Math.sqrt(sumOfSquares / dataArray.length);
}
function checkSilence() {
    // Get the time domain data (raw amplitude values)
    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);

    // Calculate the RMS volume
    const volume = calculateRMS(dataArray) * 255; // Scale back to 0-255 for simpler comparison

    // Check if volume is below the threshold
    if (volume < SILENCE_THRESHOLD) {
        silentTime += MONITOR_INTERVAL;
    } else {
        // If loud enough, reset the silent time counter
        silentTime = 0;
    }
    
    // Check if silence duration has been exceeded
    document.getElementById('theCount').textContent = silentTime.toString().padStart(5,'0')
    if (silentTime >= SILENCE_DURATION) {
        // Silence detected!
        stopRecording();
        silentTime = 0 ;
        statusMessage.textContent = "Recording stopped automatically: 2 seconds of silence detected.";
        statusMessage.classList.replace('bg-green-100', 'bg-red-100');
    }

    // Update status visually (optional)
    const volumeBarWidth = Math.min(100, (volume / 100) * 100); 
    statusMessage.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">Recording... (Volume: ${volume.toFixed(2)})</span>
            <div class="w-24 h-2 bg-gray-300 rounded overflow-hidden">
                <div style="width: ${volumeBarWidth}%;" class="h-full bg-green-500 transition-all duration-100"></div>
            </div>
        </div>
    `;
}

/**
 * Converts a Blob (like an audio recording) to a Base64 string.
 * @param {Blob} blob 
 * @returns {Promise<string>} Base64 data string.
 */
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};



// --- Core Application Logic ---

function updateUI(status, isRecordingState = false, isLoading = false) {
    isRecording = isRecordingState;
    statusDisplay.textContent = status;

    // Update button styles
    recordButton.classList.remove('btn-pulse', 'bg-red-500', 'bg-red-600', 'bg-gray-400');
    recordButton.classList.add('transition-colors');

    if (isLoading) {
        micIcon.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        recordButton.classList.remove('hover:scale-105', 'focus:ring-red-300');
        recordButton.classList.add('bg-gray-400');
        recordButton.disabled = true;
    } else {
        micIcon.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        recordButton.disabled = false;
        recordButton.classList.add('hover:scale-105', 'focus:ring-red-300');

        if (isRecording) {
            recordButton.classList.add('bg-red-500', 'btn-pulse');
            statusDisplay.classList.replace('bg-blue-100', 'bg-red-100');
            statusDisplay.classList.replace('text-blue-800', 'text-red-800');
        } else {
            recordButton.classList.add('bg-red-500');
            statusDisplay.classList.replace('bg-red-100', 'bg-blue-100');
            statusDisplay.classList.replace('text-red-800', 'text-blue-800');
        }
    }
}

async function startRecording() {
    updateUI("Requesting microphone permission...", false, false);
    transcriptionOutput.textContent = "Start talking now...";

    try {
        // Get microphone stream
        if(!stream){
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        

        mediaRecorder.onstop = () => {
            clearInterval(monitoringIntervalId);
            
            // Display the result
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            // const audioUrl = URL.createObjectURL(audioBlob);
            
            
            isRecording = false;        
            updateUI("Processing audio and calling transcription API...", false, true);
            transcribeAudio(audioBlob)
                .then(()=>{
                    AskGemini(transcriptionOutput.textContent, document.getElementById('gemeniOutput'));
                })
        };
        // 3. Setup Web Audio API for Analysis (The new part!)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        // We use a small FFT size for fast response to volume changes
        analyser.fftSize = 512; 
        
        // Connect the microphone source to the analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        // Note: We don't connect the analyser to the audioContext.destination 
        // because we don't want to play back the user's voice during recording.

        // 4. Start the silence monitoring loop
        monitoringIntervalId = setInterval(checkSilence, MONITOR_INTERVAL);

        // 5. Start the MediaRecorder
        mediaRecorder.start();
        
        updateUI("Recording...", true, false);

    } catch (error) {
        console.error('Error accessing media devices:', error);
        updateUI(`ERROR: Could not access mic. Check permissions. (${error.name})`, false, false);
    }
}

async function startRecordingV1Oringinal() {
    updateUI("Requesting microphone permission...", false, false);
    transcriptionOutput.textContent = "Start talking now...";

    try {
        // Get microphone stream
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        

        mediaRecorder.onstop = () => {
            updateUI("Processing audio and calling transcription API...", false, true);
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            transcribeAudio(audioBlob)
                .then(()=>{
                    AskGemini(transcriptionOutput.textContent, document.getElementById('gemeniOutput'));
                })
        };

        mediaRecorder.start();
        updateUI("Recording... Press the button to stop and transcribe.", true, false);

    } catch (error) {
        console.error('Error accessing media devices:', error);
        updateUI(`ERROR: Could not access mic. Check permissions. (${error.name})`, false, false);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        // Stop the microphone stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        clearInterval(monitoringIntervalId);
        updateUI("Stopping recording...", false, false);
    }
}

async function transcribeAudio(audioBlob) {
    try {
        // 1. Convert Blob to Base64
        const base64Audio = await blobToBase64(audioBlob);

        // 2. Build the API payload
        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: "Transcribe this audio recording accurately and provide only the resulting text." },
                    {
                        inlineData: {
                            mimeType: audioBlob.type, // e.g., 'audio/webm'
                            data: base64Audio
                        }
                    }
                ]
            }],
            // System instructions to guide the model's output formatting
            systemInstruction: {
                parts: [{ text: "You are a professional transcriber. Provide only the text content of the audio, without any introductory or concluding remarks." }]
            },
        };

        // 3. Make the API call with retry mechanism
        const apiCall = () => fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const response = await fetchWithRetry(apiCall);
        const result = await response.json();

        // 4. Extract and display the transcription
        const transcription = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (transcription) {
            transcriptionOutput.textContent = transcription;
            updateUI("Transcription complete!", false, false);

        } else {
            transcriptionOutput.textContent = "Transcription failed or returned no text. Try speaking louder or more clearly.";
            console.error("API response missing transcription text:", result);
            updateUI("Transcription failed.", false, false);
        }

    } catch (error) {
        console.error('Transcription API Error:', error);
        transcriptionOutput.textContent = `Error: Failed to transcribe the audio. ${error.message}`;
        updateUI("Transcription Error.", false, false);
    }
}


// --- Event Listeners ---

recordButton.addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

// Optional: Listen for the 'Enter' key press anywhere on the page to stop recording
document.addEventListener('keydown', (e) => {
    // Check if the target is not an input field to avoid accidental submission
    if (e.key === 'Enter' && isRecording) {
        e.preventDefault(); // Prevent default browser action (like form submission)
        stopRecording();
    }
});

// Initial UI state setup
updateUI("Ready to record.", false, false);