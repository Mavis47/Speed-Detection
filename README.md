# 🚗 Real-Time Vehicle Speed Detection using YOLOv8 & OpenCV

A real-time vehicle speed detection system built using **Python, OpenCV, and Ultralytics YOLOv8**. The application detects and tracks vehicles in a video stream, measures their speed between predefined reference lines, and displays the calculated speed in real time.

---

## ✨ Features

- 🚘 Real-time vehicle detection using YOLOv8
- 🎯 Multi-object tracking with unique IDs
- ⚡ Speed estimation in km/h
- 📹 Supports video files and RTSP/IP camera streams
- 📊 Bounding boxes with vehicle ID and speed
- 🛣️ Configurable detection lines/regions
- 🐍 Simple Python implementation

---

## 🛠️ Technologies Used

- Python 3.12
- OpenCV
- Ultralytics YOLOv8
- Nextjs

---

## 📂 Project Structure

```
Speed-Detection/
│
├── backend/
│   ├── main.py
│   ├── speed_detection.py
│   ├── orientation.py
│   └── ...
│
├── frontend (Nextjs)
├── README.md
└── .gitignore
```

---

# 📸 Sample Results

Screenshots and demo videos are available inside the **samples/** folder.

```
samples/

```

---

# ⚙️ Installation

## 1. Install Python

Download and install **Python 3.12** from:

https://www.python.org/downloads/

During installation, make sure to enable:

✔ Add Python to PATH

---

## 2. Clone the Repository

```bash
git clone https://github.com/Mavis47/Speed-Detection.git

cd Speed-Detection
```

---

## 3. Create a Virtual Environment

Windows

```bash
python -m venv venv

venv\Scripts\activate
```

Linux/macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
pip install opencv-python

pip install ultralytics

```

or install everything together

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Project

```bash
python backend/main.py
```

---

# 📦 Dependencies

- Python 3.12
- OpenCV
- Ultralytics

---

# 📹 Input

The system supports

- MP4 Videos
- AVI Videos
- RTSP Streams
- IP Cameras

---

# 🚘 Output

The application displays

- Vehicle Detection
- Vehicle Tracking ID
- Estimated Vehicle Speed (km/h)
- Bounding Boxes
- Detection Lines

---

# 📁 Sample Media

Example screenshots and videos can be found in

```
samples

```
---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request
---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
