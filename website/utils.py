import time

from google import genai

from gemini_workshop.settings import GOOGLE_API_KEY


client = genai.Client(api_key=GOOGLE_API_KEY)


def upload_file(file_path):
    file = client.files.upload(file=file_path)

    while file.state == "PROCESSING":
        print("Waiting for file to be processed...")
        time.sleep(10)
        file = client.files.get(name=file.name)

    if file.state == "FAILED":
        raise ValueError(file.state)

    print(f"file processing complete: " + file.uri)
    return file
