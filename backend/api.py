from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import face_recognition
import os
import base64
import serial
import shutil
import uuid
import imghdr
from config import SERIAL_PORT, BAUD_RATE, GCP_BUCKET_NAME
from face_recognition_utils import process_base64_face_recognition
from cloud_utils import upload_to_bucket
from serial_comm import send_message_to_esp32
from google.cloud import storage
from google.auth.exceptions import DefaultCredentialsError

app = FastAPI()

#change needed when in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    serial_connection = serial.Serial(port=SERIAL_PORT, baudrate=BAUD_RATE, timeout=1)
    print("Serial connection established.")
except serial.SerialException as e:
    print(f"Error: Unable to open serial port. {e}")
    serial_connection = None


class CaptureRequest(BaseModel):
    user_id: str
    captured_image_base64: str
    registered_image_base64: str


def encode_blob_to_base64(blob):
    image_bytes = blob.download_as_bytes()
    return base64.b64encode(image_bytes).decode('utf-8')


@app.get("/")
def home():
    return {"message": "Smart Vehicle Ignition API is running!"}


@app.post("/register/")
async def register_user(
    user_id: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCP_BUCKET_NAME)
        prefix = f"registration_images/{user_id}/"
        blobs = list(bucket.list_blobs(prefix=prefix))
        
        if any(blob.name.endswith(('.jpg', '.jpeg', '.png')) for blob in blobs):
            raise HTTPException(status_code=409, detail="Email already registered. Please log in.")

        # Save the uploaded image temporarily
        temp_path = f"temp_{image.filename}"
        with open(temp_path, "wb") as f:
            f.write(await image.read())
        
        #check MIME type
        if imghdr.what(temp_path) not in ["jpeg", "png", "jpg"]:
            os.remove(temp_path)
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a valid image")
        
        image_data = face_recognition.load_image_file(temp_path)
        face_locations = face_recognition.face_locations(image_data)

        if not face_locations:
            os.remove(temp_path)
            raise HTTPException(status_code=422, detail="No face detected in the uploaded image. Please try another photo.")

        # Upload to Google Cloud Storage
        blob = bucket.blob(f"{prefix}{image.filename}")
        blob.upload_from_filename(temp_path)
        gcs_path = f"gs://{GCP_BUCKET_NAME}/{prefix}{image.filename}"
        print(f"Uploaded to {gcs_path}")

        # Clean up
        os.remove(temp_path)

        return {"success": True, "message": "User registered successfully! Login using the email"}
    
    except HTTPException as http_exec:
        raise http_exec
    except DefaultCredentialsError:
        raise HTTPException(status_code=401, detail="Google Cloud credentials not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")



@app.post("/capture-and-recognize/")
def capture_and_recognize(request: CaptureRequest):
    try:
        if not serial_connection:
            return {"success": False, "vehicle_state": "LOCKED", "message": "Please connect the ESP32 to the laptop"}


        result = process_base64_face_recognition(
            serial_connection,
            request.user_id,
            request.captured_image_base64,
            request.registered_image_base64
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/stop-vehicle/")
def stop_vehicle():
    if serial_connection:
        send_message_to_esp32(serial_connection, "STOP")
    return {"message": "Vehicle stopped."}


@app.post("/login/")
def login_user(user_id: str = Form(...)):
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCP_BUCKET_NAME)
        prefix = f"registration_images/{user_id}/"
        blobs = list(bucket.list_blobs(prefix=prefix))

        if not blobs:
            raise HTTPException(status_code=404, detail="User not found, Please register first")

        for blob in blobs:
            if blob.name.endswith((".jpg", ".jpeg", ".png")):
                base64_image = encode_blob_to_base64(blob)
                return {
                    "message": "Login successful",
                    "user_id": user_id,
                    "base64_image": base64_image
                }

        raise HTTPException(status_code=400, detail="No valid image found in user folder.")
    except DefaultCredentialsError:
       raise HTTPException(status_code=401, detail="Google Cloud credentials not found.")
    except HTTPException as http_exec:
        raise http_exec
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/check-serial/")
def check_serial_status():
    if serial_connection and serial_connection.is_open:
        return {"status": "Serial connection is open"}
    return {"status": "Serial connection not available"}

# Run the API using:
# uvicorn api:app --host 0.0.0.0 --port 8000