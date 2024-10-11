// Access the webcam
const video = document.getElementById('webcam');
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});

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
        setAvatar(gender); // Update avatar based on gender
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
