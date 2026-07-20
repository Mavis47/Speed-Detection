import cv2
from ultralytics import YOLO
import time,json
from orientation import ccw,intersect
from pathlib import Path

model = YOLO('yolov8n.pt')

VIDEO_PATH="rtsp://admin:password12@192.168.2.52:554/cam/realmonitor?channel=1&subtype=0"

cap = cv2.VideoCapture(VIDEO_PATH)

red_color = (0, 0, 255)     # Pure Red
blue_color = (255, 0, 0)    # Pure Blue
green_color = (0, 255, 0)   # Pure Green
text_color = (255, 255, 255) # White text for the line labels

BASE_DIR = Path(__file__).resolve().parent

ROI_PATH = BASE_DIR.parent / "frontend" / "roi.json"

with open(ROI_PATH) as f:
    rois = json.load(f)

red_line = None
blue_line = None

for roi in rois:
    if roi["type"] == "red-line":
        red_line = roi["points"]

    elif roi["type"] == "blue-line":
        blue_line = roi["points"]

track_history = {}
entry_time = {}
vehicle_speed = {}
DISTANCE_METERS = 7

redA = (red_line[0], red_line[1])
redB = (red_line[2], red_line[3])

blueA = (blue_line[0], blue_line[1])
blueB = (blue_line[2], blue_line[3])

while True:
    ret,frame = cap.read()
    if not ret:
        break
    
    frame = cv2.resize(frame,(1280,720))

    results = model.track(frame,persist=True,conf=0.5,tracker="bytetrack.yaml",classes=[2,3,5,7])

    # Show lines
    if red_line:
        x1, y1, x2, y2 = red_line
        cv2.line(frame, (x1, y1), (x2, y2), red_color, 3)

    if blue_line:
        x1, y1, x2, y2 = blue_line
        cv2.line(frame, (x1, y1), (x2, y2), blue_color, 3)

    # 2. Extract bounding boxes and tracking IDs
    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy()     
        track_ids = results[0].boxes.id.int().cpu().tolist() 

        for box, track_id in zip(boxes, track_ids):
            x3, y3, x4, y4 = box
            id = track_id
            
            cx = int(x3 + x4) // 2
            cy = int(y3 + y4) // 2

            current = (cx, cy)

            if id in track_history:

                previous = track_history[id]

                # Vehicle crossed RED line
                if intersect(previous, current, redA, redB):

                    if id not in entry_time:
                        entry_time[id] = time.time()

                # Vehicle crossed BLUE line
                if intersect(previous, current, blueA, blueB):

                    if id in entry_time and id not in vehicle_speed:

                        elapsed = time.time() - entry_time[id]

                        speed = (DISTANCE_METERS / elapsed) * 3.6

                        vehicle_speed[id] = speed
                
            if id in vehicle_speed:
                cv2.putText(frame,f"{vehicle_speed[id]:.1f} km/h",(int(x3), int(y3)-20),cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,255,255),2)

            track_history[id] = current

            # --- PERSISTENT DRAWING ---
            cv2.circle(frame, (cx, cy), 4, red_color, -1)
            cv2.rectangle(frame, (int(x3), int(y3)), (int(x4), int(y4)), green_color, 2)
            cv2.putText(frame, f"ID: {id}", (int(x3), int(y3) - 5), cv2.FONT_HERSHEY_COMPLEX, 0.6, text_color, 1)
    
    cv2.imshow("frames", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()