// Access the webcam
const video = document.getElementById('webcam');
const toggleButton = document.getElementById('toggleButton');
let stream; // To hold the media stream

// Load the face-api.js model and initiate gender detection
async function loadModels() {
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('./models'); 
        await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
        await faceapi.nets.ageGenderNet.loadFromUri('./models');
        console.log('Models loaded successfully');
    } catch (err) {
        console.error('Error loading models: ', err);
    }
}

// Event listener for the toggle button
toggleButton.addEventListener('click', async () => {
    if (toggleButton.textContent === 'Turn On Webcam') {
        await loadModels(); // Load models when turning on the webcam
        startWebcam();
    } else {
        stopWebcam();
    }
});

// Function to start the webcam
async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        toggleButton.textContent = 'Turn Off Webcam'; // Update button text
        detectGender(); // Start gender detection
    } catch (err) {
        console.error('Error accessing webcam: ', err);
    }
}

// Function to stop the webcam
function stopWebcam() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop each track
        video.srcObject = null; // Clear the video source
        toggleButton.textContent = 'Turn On Webcam'; // Update button text
        document.getElementById('genderDisplay').innerText = 'Detected Gender: '; // Clear gender display
    }
}

// Continuous gender detection
async function detectGender() {
    setInterval(async () => {
        const detection = await faceapi.detectSingleFace(video).withAgeAndGender();
        if (detection) {
            const gender = detection.gender;
            console.log(`Detected gender: ${gender}`); // Log the detected gender
            setAvatar(gender); // Update avatar based on gender
            document.getElementById('genderDisplay').innerText = `Detected Gender: ${gender}`; // Display gender on webpage
        }
    }, 1000); // Check every second
}

// Update the avatar based on gender
function setAvatar(gender) {
    const avatar = document.getElementById('avatar');
    
    if (gender === 'male') {
        avatar.src = './images/female_avatar.jpeg';  // Path to female avatar image
    } else if (gender === 'female') {
        avatar.src = './images/male_avatar.jpeg';    // Path to male avatar image
    }
}
