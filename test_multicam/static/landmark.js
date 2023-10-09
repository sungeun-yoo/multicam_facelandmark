import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

const videoWidth = 320;
const numberOfCams = 9; // to create 5 instances
let faceLandmarkers = [];
let drawingUtilsList = [];
let lastVideoTimes = Array(numberOfCams).fill(-1);
let resultsList = Array(numberOfCams).fill(undefined);
let webcamRunning = true;

async function createFaceLandmarker(index) {
    return new Promise(async (resolve) => {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarkers[index] = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });

        resolve(); // Promise를 완료합니다.
    });
}

async function getVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
}


const videoDevices = await getVideoDevices();

for (let i = 0; i < numberOfCams; i++) {
    await createFaceLandmarker(i);

    const video = document.getElementById(`cam${i + 1}`);
    const canvasElement = document.getElementById(`canvas${i + 1}`);
    const canvasCtx = canvasElement.getContext("2d");
    drawingUtilsList.push(new DrawingUtils(canvasCtx));

    if (i < videoDevices.length) {
        const constraints = {
            video: {
                deviceId: videoDevices[i].deviceId
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => predictWebcam(video, canvasElement, i));
        });
    } else {
        console.error(`Camera ${i + 1}를 사용할 수 없습니다.`);
    }
}




function updateEyeBlinkScores(camNumber, eyeBlinkLeftScore, eyeBlinkRightScore) {
    if(eyeBlinkLeftScore !== null) {
        let widthLeft = eyeBlinkLeftScore * 300; // 0~1.0 값을 0~300px 값으로 변환
        document.getElementById(`eyeBlinkLeft-score${camNumber}`).innerText = eyeBlinkLeftScore.toFixed(2); // 소수점 두 자리까지 표시
        document.getElementById(`eyeBlinkLeft-bar${camNumber}`).style.width = widthLeft + 'px';
    }

    if(eyeBlinkRightScore !== null) {
        let widthRight = eyeBlinkRightScore * 300; // 0~1.0 값을 0~300px 값으로 변환
        document.getElementById(`eyeBlinkRight-score${camNumber}`).innerText = eyeBlinkRightScore.toFixed(2); // 소수점 두 자리까지 표시
        document.getElementById(`eyeBlinkRight-bar${camNumber}`).style.width = widthRight + 'px';
    }
    // 둘 다 0.5가 넘는지 검사
    if(eyeBlinkLeftScore > 0.5 && eyeBlinkRightScore > 0.5) {
        document.getElementById(`canvas${camNumber}`).style.border = "10px solid red";
        console.log(`${eyeBlinkLeftScore} ${eyeBlinkRightScore}Excute border RED`);
    } else {
        document.getElementById(`canvas${camNumber}`).style.border = "0px solid red";
        console.log(`${eyeBlinkLeftScore} ${eyeBlinkRightScore}Excute border NORMAL`);
    }
}


async function predictWebcam(video, canvasElement, index) {
    // At the very beginning of your script
    const startTime = performance.now();

    const radio = video.videoHeight / video.videoWidth;
    video.style.width = videoWidth + "px";
    video.style.height = videoWidth * radio + "px";
    canvasElement.style.width = videoWidth + "px";
    canvasElement.style.height = videoWidth * radio + "px";
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    if (lastVideoTimes[index] !== video.currentTime) {
        lastVideoTimes[index] = video.currentTime;
        resultsList[index] = faceLandmarkers[index].detectForVideo(video, performance.now());
    }
    //if (resultsList[index].faceLandmarks) {
    //    for (const landmarks of resultsList[index].faceLandmarks) {
    //        drawingUtilsList[index].drawConnectors(
    //            landmarks,
    //            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
    //            { color: "#C0C0C070", lineWidth: 1 }
    //        );
    //    }
    //}

    if (webcamRunning) {
        window.requestAnimationFrame(() => predictWebcam(video, canvasElement, index));
    }

    const endTime = performance.now();
    
    //console.log(`Execution time for landmark.js: ${endTime - startTime}ms`);

    if (resultsList[index].faceBlendshapes && resultsList[index].faceBlendshapes[0] && resultsList[index].faceBlendshapes[0].categories) {
    
        let eyeBlinkLeftScore = null;
        let eyeBlinkRightScore = null;
    
        resultsList[index].faceBlendshapes[0].categories.forEach((shape) => {
            if (shape.categoryName === 'eyeBlinkLeft') {
                eyeBlinkLeftScore = shape.score;
                //console.log(`Excute ${shape.categoryName} ${shape.score}`);
            } else if (shape.categoryName === 'eyeBlinkRight') {
                eyeBlinkRightScore = shape.score;
                //console.log(`Excute ${shape.categoryName} ${shape.score}`);
            }
        });
    
        // 두 스코어를 저장한 후에 업데이트 함수를 호출
        updateEyeBlinkScores(index+1, eyeBlinkLeftScore, eyeBlinkRightScore);
    }else{
        updateEyeBlinkScores(index+1, 0, 0);
    }
    
}




