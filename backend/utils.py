import os
import time
import random
import string


#For future use, not used in the project currently
def generate_unique_filename(original_filename):
    timestamp = int(time.time())
    random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    file_extension = os.path.splitext(original_filename)[1]
    new_filename = f"{os.path.splitext(original_filename)[0]}_{timestamp}_{random_string}{file_extension}"
    return new_filename
