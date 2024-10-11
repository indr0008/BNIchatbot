// Access the webcam
const video = document.getElementById('webcam');
const toggleButton = document.getElementById('toggleButton');
let stream; // To hold the media stream

toggleButton.addEventListener('click', () => {
    if (toggleButton.textContent === 'Turn On Webcam') {
        startWebcam();
    } else {
        stopWebcam();
    }
});

// Function to start the webcam
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = stream;
            toggleButton.textContent = 'Turn Off Webcam'; // Update button text
        })
        .catch((err) => {
            console.error('Error accessing webcam: ', err);
        });
}

// Function to stop the webcam
function stopWebcam() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop each track
        video.srcObject = null; // Clear the video source
        toggleButton.textContent = 'Turn On Webcam'; // Update button text
    }
}

// Load the face-api.js model and detect gender
async function detectGender() {
    // Load the necessary models from face-api.js
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models'); // Adjust path for GitHub Pages
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.ageGenderNet.loadFromUri('./models');

    // Detect the face and gender from the video stream
    const detection = await faceapi.detectSingleFace(video).withAgeAndGender();
    
    if (detection) {
        const gender = detection.gender;
        console.log(`Detected gender: ${gender}`); // Log the detected gender
        setAvatar(gender); // Update avatar based on gender
        document.getElementById('genderDisplay').innerText = `Detected Gender: ${gender}`; // Display gender on webpage
    }
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

// Trigger gender detection when the video stream is ready
video.addEventListener('loadeddata', detectGender);
