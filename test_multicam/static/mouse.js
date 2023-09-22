let isDragging = false;
let targetElement;
let offsetX, offsetY, initialX, initialY;

function onMouseDown(event) {
    if (event.target.tagName !== 'VIDEO') return;

    targetElement = event.target;
    isDragging = true;
    initialX = event.clientX;
    initialY = event.clientY;
    offsetX = targetElement.offsetLeft;
    offsetY = targetElement.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    targetElement.style.cursor = 'grabbing';
}

function onMouseMove(event) {
    if (!isDragging) return;
    const dx = event.clientX - initialX;
    const dy = event.clientY - initialY;
    targetElement.style.left = (offsetX + dx) + "px";
    targetElement.style.top = (offsetY + dy) + "px";
}

function onMouseUp(event) {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    targetElement.style.cursor = 'grab';
}

document.getElementById('webcam1').addEventListener('mousedown', onMouseDown);
document.getElementById('webcam2').addEventListener('mousedown', onMouseDown);
