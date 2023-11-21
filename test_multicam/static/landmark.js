import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
const videoWidth = 640;
const numberOfCams = 9; // to create 5 instances
let faceLandmarkers = [];
let drawingUtilsList = [];
let lastVideoTimes = Array(numberOfCams).fill(-1);
let resultsList = Array(numberOfCams).fill(undefined);
let webcamRunning = true;

async function createFaceLandmarkers() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  const promises = [];
  for (let i = 0; i < numberOfCams; i++) {
    promises.push(
      FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      })
    );
  }

  faceLandmarkers = await Promise.all(promises);
}

async function getVideoDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'videoinput');
}

async function setupCameras() {
  const videoDevices = await getVideoDevices();
  
  for (let i = 0; i < numberOfCams; i++) {
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

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.addEventListener("loadeddata", () => predictWebcam(video, canvasElement, i));
    } else {
      console.error(`Camera ${i + 1}를 사용할 수 없습니다.`);
    }
  }
}

function updateEyeBlinkScores(camNumber, eyeBlinkLeftScore, eyeBlinkRightScore) {
  const eyeBlinkLeftScoreElement = document.getElementById(`eyeBlinkLeft-score${camNumber}`);
  const eyeBlinkLeftBarElement = document.getElementById(`eyeBlinkLeft-bar${camNumber}`);
  const eyeBlinkRightScoreElement = document.getElementById(`eyeBlinkRight-score${camNumber}`);
  const eyeBlinkRightBarElement = document.getElementById(`eyeBlinkRight-bar${camNumber}`);

  if (eyeBlinkLeftScore !== null) {
    let widthLeft = eyeBlinkLeftScore * 300; // 0~1.0 값을 0~300px 값으로 변환
    eyeBlinkLeftScoreElement.innerText = eyeBlinkLeftScore.toFixed(2); // 소수점 두 자리까지 표시
    eyeBlinkLeftBarElement.style.width = widthLeft + 'px';
  }

  if (eyeBlinkRightScore !== null) {
    let widthRight = eyeBlinkRightScore * 300; // 0~1.0 값을 0~300px 값으로 변환
    eyeBlinkRightScoreElement.innerText = eyeBlinkRightScore.toFixed(2); // 소수점 두 자리까지 표시
    eyeBlinkRightBarElement.style.width = widthRight + 'px';
  }

  // 둘 다 0.5가 넘는지 검사
  if (eyeBlinkLeftScore > 0.5 && eyeBlinkRightScore > 0.5) {
    document.getElementById(`canvas${camNumber}`).style.border = "10px solid red";
    //console.log(`${eyeBlinkLeftScore} ${eyeBlinkRightScore}Excute border RED`);
  } else {
    document.getElementById(`canvas${camNumber}`).style.border = "0px solid red";
    //console.log(`${eyeBlinkLeftScore} ${eyeBlinkRightScore}Excute border NORMAL`);
  }
}

async function predictWebcam(video, canvasElement, index) {
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
    resultsList[index] = await faceLandmarkers[index].detectForVideo(video, performance.now());
  }

  if (webcamRunning) {
    window.requestAnimationFrame(() => predictWebcam(video, canvasElement, index));
  }

  const endTime = performance.now();
  if (resultsList[index].faceBlendshapes && resultsList[index].faceBlendshapes[0] && resultsList[index].faceBlendshapes[0].categories) {
    let eyeBlinkLeftScore = null;
    let eyeBlinkRightScore = null;

    resultsList[index].faceBlendshapes[0].categories.forEach((shape) => {
      if (shape.categoryName === 'eyeBlinkLeft') {
        eyeBlinkLeftScore = shape.score;
      } else if (shape.categoryName === 'eyeBlinkRight') {
        eyeBlinkRightScore = shape.score;
      }
    });

    updateEyeBlinkScores(index + 1, eyeBlinkLeftScore, eyeBlinkRightScore);
  } else {
    updateEyeBlinkScores(index + 1, 0, 0);
  }
}

(async () => {
  await createFaceLandmarkers();
  await setupCameras();
})();