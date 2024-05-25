const videoElement = document.getElementById('video');
const cameraSelector = document.getElementById('cameraSelector');
let devices = [];

async function getCameras() {
    try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        devices = deviceInfos.filter(deviceInfo => deviceInfo.kind === 'videoinput');
        populateCameraSelector();
        if (devices.length > 0) {
            startCamera(devices[0].deviceId);
        }
    } catch (error) {
        console.error('Error accessing cameras: ', error);
    }
}

function populateCameraSelector() {
    cameraSelector.innerHTML = '';
    devices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraSelector.appendChild(option);
    });
    cameraSelector.addEventListener('change', () => {
        startCamera(cameraSelector.value);
    });
}

async function startCamera(deviceId) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
        video: {
            deviceId: { exact: deviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
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

getCameras();
