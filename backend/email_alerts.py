import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
from config import EMAIL_USER, EMAIL_PASS, SEND_EMAIL


subject = "VEHICLE INTRUDER ALERT"
body = "The person in the image tried to start your vehicle"

def send_email_with_image(recipient_email, image_path):
    if SEND_EMAIL == "no":
        print("In lite mode, so email services are not active")
        return
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = recipient_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        with open(image_path, "rb") as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(image_path)}')
            msg.attach(part)

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, recipient_email, msg.as_string())
        server.quit()

        print("Email sent successfully.")
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print(f"Failed to send email: {e}")