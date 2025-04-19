import serial
import time

def send_message_to_esp32(serial_connection, message):
    if not serial_connection:
        print("No serial connection available")
        return False
    try:
        formatted_message = message + '\n'
        serial_connection.write(formatted_message.encode())
        print(f"Sent message: {formatted_message.strip()}")
        time.sleep(0.5)
        return True
    except serial.SerialException as e:
        print(f"Error in serial communication: {e}")
        return False