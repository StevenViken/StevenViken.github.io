const videoElement = document.getElementById('video');
let currentCameraIndex = 0;
let devices = [];

async function getCameras() {
    try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        devices = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput');
        if (devices.length > 0) {
            startCamera(devices[currentCameraIndex].deviceId);
        }
    } catch (error) {
        console.error('Error accessing cameras: ', error);
    }
}

async function startCamera(deviceId) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
        video: {
            deviceId: { exact: deviceId }
        }
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error starting camera: ', error);
    }
}

videoElement.addEventListener('click', () => {
    currentCameraIndex = (currentCameraIndex + 1) % devices.length;
    startCamera(devices[currentCameraIndex].deviceId);
});

getCameras();