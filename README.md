# Smart Vehicle Ignition

Smart Vehicle Ignition is a facial recognition-based application that securely unlocks and controls vehicle ignition using a user's face, eliminating the need for physical keys and enhancing anti-theft measures.

---

## 🚀 Project Overview
This project demonstrates the integration of AI-based face recognition, IoT, and cloud services to prevent unauthorized vehicle access. Built to explore modern, keyless vehicle security systems and to serve as a learning project for cloud-IoT integration.

---

## 🔧 Tech Stack
- **Frontend**: React
- **Backend**: Python (Flask API)
- **IoT**: ESP32, Arduino IDE, Relay Module, Buzzer Module, Motor, Battery, Jumper Wires, Breadboard
- **Cloud**: Google Cloud Storage (Image Buckets)

---

## 💡 Key Features
- Face recognition-based ignition system
- Google Cloud integration for image storage
- Email alert system for unauthorized access
- Buzzer alerts and motor control via ESP32
- Cooldown period after failed attempts

---

## ⚙️ IoT Hardware Setup
**Hardware Components**:
- ESP32 microcontroller
- Laptop camera
- Relay module
- Buzzer module
- Motor and battery
- Jumper wires, Breadboard

**Connections**:
- **Relay**:
  - Signal (IN): GPIO pin 26
  - VCC: 3.3V
  - GND: GND
- **Buzzer**:
  - Signal (IN): GPIO pin 27
  - VCC: 3.3V
  - GND: GND
- **Motor + Battery + Relay**:
  - One motor wire → common (center) pin of relay
  - Other motor wire → one terminal of battery
  - Other battery wire → normally closed (right) pin of relay

**Driver**: Install CP210x USB to UART Bridge driver.

---

## ☁️ Cloud Setup
1. Create a Google Cloud account.
2. Enable Google Cloud Storage API.
3. Create buckets in Storage.
4. Create a service account.
5. Download the `service-account.json` credentials file.
6. Place it inside the `backend/` folder. (Note: This file is gitignored.)

---

## 🔌 ESP32 Firmware
**Language**: Arduino (C++)

**Script**: ESP32Code.cpp

**Communication**: Serial via USB COM3 port

**Behavior**:
- Activates relay (motor ignition) on MATCHED
- Buzzer alert on NOT_MATCHED
- Repeated failures trigger 5 beep alerts
- STOP command halts motor

---

## 🧪 How to Run the Project
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test Flow
- Connect ESP32 via USB
- Run backend server
- Start frontend client
- Use laptop camera to scan face
- System compares with cloud image
- If matched, ESP32 starts motor

---

## 🛡️ Security Measures
- Email alerts on unauthorized access
- Cooldown state to prevent spamming relay

---

## 📈 Future Enhancements
- Anti-spoofing via liveness detection
- Improved lighting adaptation

---

## 👨‍💻 Author
**Charan G**

---

## 📂 Folder Structure
```
smart-vehicle-ignition/
├── backend/
│   ├── api.py
│   ├── cloud_utils.py
│   ├── config.py
│   ├── email_alerts.py
│   ├── face_recognition_utils.py
│   ├── requirements.txt
│   ├── serial_comm.py
│   ├── service-account.json  # (in .gitignore)
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── ESP32/
│   └── esp32_relay_control.ino
└── README.md
```

---



## 📝 License
This project is licensed under the [MIT License](LICENSE).

---

Let your face be the key to ignition! 🔑🚗

