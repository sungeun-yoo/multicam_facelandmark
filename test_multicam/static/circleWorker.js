self.onmessage = function(event) {
    const imageData = event.data;
    const width = imageData.width;
    const height = imageData.height;

    const rectWidth = 50;
    const rectHeight = 50;

    // 사각형의 시작 위치 계산
    const startX = (width - rectWidth) / 2;
    const startY = (height - rectHeight) / 2;

    for (let y = startY; y < startY + rectHeight; y++) {
        for (let x = startX; x < startX + rectWidth; x++) {
            const index = (y * width + x) * 4;  // imageData는 RGBA 값이므로 4를 곱합니다.
            imageData.data[index] = 0;       // Red
            imageData.data[index + 1] = 0;   // Green
            imageData.data[index + 2] = 0;   // Blue
            imageData.data[index + 3] = 255; // Alpha (투명도; 255는 완전 불투명)
        }
    }

    self.postMessage(imageData); // 수정된 데이터를 메인 스레드로 보냅니다.
};
