from google.cloud import storage
import os
from utils import generate_unique_filename

storage_client = storage.Client()

def download_registered_images(bucket_name, user_id):
    try:
        bucket = storage_client.bucket(bucket_name)
        folder_prefix = f"registration_images/{user_id}/"
        blobs = bucket.list_blobs(prefix=folder_prefix)

        downloaded_images = []
        os.makedirs("registered_images", exist_ok=True)

        for blob in blobs:
            if not blob.name.endswith("/"):
                filename = os.path.basename(blob.name)
                local_path = os.path.join("registered_images", filename)
                blob.download_to_filename(local_path)
                downloaded_images.append(local_path)
                print(f"Downloaded: {local_path}")

        return downloaded_images

    except Exception as e:
        print(f"Error downloading images: {e}")
        return []

def upload_to_bucket(bucket_name, source_file_name, destination_blob_name):
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(source_file_name)
        print(f"File {source_file_name} uploaded to {destination_blob_name}.")
    except Exception as e:
        print(f"Error uploading file: {e}")