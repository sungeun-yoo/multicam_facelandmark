document.addEventListener('DOMContentLoaded', function() {
    const cameraGrid = document.getElementById('cameraGrid');
    const max_col = 5;
    for (let j = 0; j < 2; j++){
        for (let i = 1; i <= max_col; i++) {
            // Camera container
            let cameraContainer = document.createElement('div');
            cameraContainer.classList.add('camera-container');
    
            let video = document.createElement('video');
            video.id = `cam${i + j*max_col}`;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            cameraContainer.appendChild(video);
    
            let canvas = document.createElement('canvas');
            canvas.id = `canvas${i + j*max_col}`;
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
                    <div id="eyeBlinkLeft-bar${i + j*max_col}" class="score-bar"></div>
                </div>
                <div class="score-label"><span id="eyeBlinkLeft-score${i + j*max_col}">-</span></div>
            `;
            cameraInfo.appendChild(eyeBlinkLeftDiv);
    
            let eyeBlinkRightDiv = document.createElement('div');
            eyeBlinkRightDiv.classList.add('eyeBlinkRight-score');
            eyeBlinkRightDiv.innerHTML = `
                <div class="label">Eye Blink Right:</div>
                <div class="bar-container">
                    <div id="eyeBlinkRight-bar${i + j*max_col}" class="score-bar"></div>
                </div>
                <div class="score-label"><span id="eyeBlinkRight-score${i + j*max_col}">-</span></div>
            `;
            cameraInfo.appendChild(eyeBlinkRightDiv);
    
            cameraGrid.appendChild(cameraInfo);
        }
    }
    
    let event = new Event('camerasectionLoaded');
    document.dispatchEvent(event);
});
