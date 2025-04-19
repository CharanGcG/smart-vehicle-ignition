import face_recognition
import base64
import cv2
import numpy as np
import time
import os
from cloud_utils import upload_to_bucket
from serial_comm import send_message_to_esp32
from email_alerts import send_email_with_image

attempts_tracker = {}
MAX_ATTEMPTS = 3
COOLDOWN_SECONDS = 30

def decode_base64_image(base64_string):
    try:
        image_data = base64.b64decode(base64_string.split(",")[-1])
        nparr = np.frombuffer(image_data, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        print("Base64 decoding error:", e)
        return None

def process_base64_face_recognition(serial_connection, user_id, captured_b64, registered_b64):
    current_time = time.time()
    user_state = attempts_tracker.get(user_id, {"attempts": 0, "cooldown_until": 0})

    if user_state["cooldown_until"] > current_time:
        return {
            "success": False,
            "message": f"Too many failed attempts. Try again in {int(user_state['cooldown_until'] - current_time)} seconds.",
            "vehicle_state": "IN COOL DOWN",
            "cooldown": True
        }

    captured_img = decode_base64_image(captured_b64)
    registered_img = decode_base64_image(registered_b64)

    #Edge case handling
    if captured_img is None or registered_img is None:
        print(f"Captured img is none")
        return {"success": False, "vehicle_state": "LOCKED", "message": "Invalid image data."}

    captured_encoding = face_recognition.face_encodings(captured_img)
    registered_encoding = face_recognition.face_encodings(registered_img)


    #Edge case handling
    if not captured_encoding or not registered_encoding:
        print(f"Encoding is none")
        return {"success": False, "vehicle_state": "LOCKED", "message": "No face detected in one of the images."}



    #Comparison
    is_match = face_recognition.compare_faces([registered_encoding[0]], captured_encoding[0])[0]
    

    #Faces matched
    if is_match:
        esp32_status = send_message_to_esp32(serial_connection, "MATCHED")
        if not esp32_status:
            return {"success": False, "vehicle_state": "LOCKED", "message": "Please connect the ESP32 to the laptop"}
        print("Message sent to Esp32")
        attempts_tracker[user_id] = {"attempts": 0, "cooldown_until": 0}
        return {"success": True, "vehicle_state": "RUNNING", "message": "Face Matched! Vehicle Unlocked."}


    #Faces not matched
    esp32_status = send_message_to_esp32(serial_connection, "NOT_MATCHED")
    if not esp32_status:
        return {"success": False, "vehicle_state": "LOCKED", "message": "Please connect the ESP32 to the laptop"}
    print("Message sent to Esp32")


    user_state["attempts"] += 1


    #Cooldown state trigger
    if user_state["attempts"] >= MAX_ATTEMPTS:
        user_state["cooldown_until"] = current_time + COOLDOWN_SECONDS
        attempts_tracker[user_id] = user_state
        user_state["attempts"] = 0
        temp_image_path = "temp_intruder.jpg"
        cv2.imwrite(temp_image_path, cv2.cvtColor(captured_img, cv2.COLOR_RGB2BGR))
        send_email_with_image(user_id, temp_image_path)

        return {
            "success": False,
            "message": "Too many failed attempts. Vehicle is now in cooldown.",
            "vehicle_state": "IN COOL DOWN",
            "cooldown": True,
            "cooldown_seconds": COOLDOWN_SECONDS
        }

    
    attempts_tracker[user_id] = user_state

    temp_image_path = "temp_intruder.jpg"
    cv2.imwrite(temp_image_path, cv2.cvtColor(captured_img, cv2.COLOR_RGB2BGR))
    send_email_with_image(user_id, temp_image_path)


    return {
        "success": False,
        "message": f"Face not matched. Attempts left: {MAX_ATTEMPTS - user_state['attempts']}",
        "vehicle_state": "LOCKED",
        "cooldown": user_state["cooldown_until"] > current_time
    }
