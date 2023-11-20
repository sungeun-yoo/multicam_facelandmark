document.addEventListener('DOMContentLoaded', function() {
    const cameraGrid = document.getElementById('cameraGrid');

    for (let i = 1; i <= 2; i++){
        for (let i = 1; i <= 5; i++) {
            // Camera container
            let cameraContainer = document.createElement('div');
            cameraContainer.classList.add('camera-container');
    
            let video = document.createElement('video');
            video.id = `cam${i}`;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            cameraContainer.appendChild(video);
    
            let canvas = document.createElement('canvas');
            canvas.id = `canvas${i}`;
            cameraContainer.appendChild(canvas);
    
            cameraGrid.appendChild(cameraContainer);
        }
        for (let i = 1; i <= 5; i++) {
    
            // Camera info
            let cameraInfo = document.createElement('div');
            cameraInfo.classList.add('grid-item', 'camera-info');
    
            let eyeBlinkLeftDiv = document.createElement('div');
            eyeBlinkLeftDiv.classList.add('eyeBlinkLeft-score');
            eyeBlinkLeftDiv.innerHTML = `
                <div class="label">Eye Blink Left:</div>
                <div class="bar-container">
                    <div id="eyeBlinkLeft-bar${i}" class="score-bar"></div>
                </div>
                <div class="score-label"><span id="eyeBlinkLeft-score${i}">-</span></div>
            `;
            cameraInfo.appendChild(eyeBlinkLeftDiv);
    
            let eyeBlinkRightDiv = document.createElement('div');
            eyeBlinkRightDiv.classList.add('eyeBlinkRight-score');
            eyeBlinkRightDiv.innerHTML = `
                <div class="label">Eye Blink Right:</div>
                <div class="bar-container">
                    <div id="eyeBlinkRight-bar${i}" class="score-bar"></div>
                </div>
                <div class="score-label"><span id="eyeBlinkRight-score${i}">-</span></div>
            `;
            cameraInfo.appendChild(eyeBlinkRightDiv);
    
            cameraGrid.appendChild(cameraInfo);
        }
    }
    
    let event = new Event('camerasectionLoaded');
    document.dispatchEvent(event);
});
