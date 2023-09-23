import cv2

def detect_working_cameras(max_cameras=10):
    """작동하는 카메라 목록을 반환합니다."""
    working_cameras = []
    for i in range(max_cameras):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            ret, _ = cap.read()
            if ret:  # frame을 정상적으로 읽었는지 확인
                working_cameras.append(i)
            cap.release()
    return working_cameras

def display_working_cameras(camera_indices):
    """작동하는 카메라를 동시에 보여줍니다."""
    cameras = [cv2.VideoCapture(idx) for idx in camera_indices]
    
    while True:
        for idx, camera in zip(camera_indices, cameras):
            ret, frame = camera.read()
            if ret:
                cv2.imshow(f"Camera {idx}", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release everything
    for camera in cameras:
        camera.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    working_camera_indices = detect_working_cameras()
    if working_camera_indices:
        display_working_cameras(working_camera_indices)
    else:
        print("No working cameras detected!")
