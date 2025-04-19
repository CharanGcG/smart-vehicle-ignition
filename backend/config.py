import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
GCP_BUCKET_NAME = os.getenv("GCP_BUCKET_NAME")
SERIAL_PORT = os.getenv("SERIAL_PORT")
BAUD_RATE = int(os.getenv("BAUD_RATE"))
SEND_EMAIL = os.getenv("SEND_EMAIL")