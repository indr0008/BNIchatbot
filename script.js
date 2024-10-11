<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gender Detection with Avatar</title>
    <script defer src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js"></script>
    <style>
        /* Add some basic styles */
        #webcam {
            width: 300px;
            height: auto;
        }
        #avatar {
            width: 100px; /* Adjust avatar size as needed */
            height: auto;
        }
        #genderDisplay {
            font-size: 20px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Gender Detection with Avatar</h1>
    
    <video id="webcam" autoplay></video>
    <img id="avatar" src="./images/default_avatar.png" alt="Avatar">
    <div id="genderDisplay">Detected Gender: </div> <!-- Display detected gender here -->

    <script>
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
                console.log(`Detected gender: ${gender}`); // Log detected gender
                setAvatar(gender); // Update avatar based on gender
                updateGenderDisplay(gender); // Update displayed gender
            } else {
                console.log("No face detected"); // Log if no face is detected
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

        // Update the displayed gender on the webpage
        function updateGenderDisplay(gender) {
            const genderDisplay = document.getElementById('genderDisplay');
            genderDisplay.innerText = `Detected Gender: ${gender}`; // Show detected gender
        }

        // Trigger gender detection when the video stream is ready
        video.addEventListener('loadeddata', detectGender);
    </script>
</body>
</html>
