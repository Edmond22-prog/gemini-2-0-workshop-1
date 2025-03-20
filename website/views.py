from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, render
from google import genai

from gemini_workshop.settings import GOOGLE_API_KEY, MODEL_NAME
from website.models import UploadedFile
from website.utils import upload_file


IMAGE_PROMPT = "Describe what you see in the image."
AUDIO_PROMPT = "Listen carefully to the following audio file. Provide a brief summary"
VIDEO_PROMPT = "Describe this video."

client = genai.Client(api_key=GOOGLE_API_KEY)


def index(request):
    if request.method == "POST":
        try:
            uploaded_file = request.FILES.get("file-upload")
            if not uploaded_file:
                return HttpResponseBadRequest("No file uploaded.")

            # Save the uploaded file details to the database
            uploaded = UploadedFile.objects.create(
                file=uploaded_file, name=uploaded_file.name
            )

            file_extension = uploaded.name.split(".")[-1].lower()
            # Map file extensions to types and prompts
            file_types_and_prompts = {
                "image": (["jpg", "jpeg", "png", "gif"], IMAGE_PROMPT),
                "audio": (["mp3", "wav"], AUDIO_PROMPT),
                "video": (["mp4"], VIDEO_PROMPT),
            }

            # Determine file type and prompt
            file_type, prompt = None, None
            for f_type, (extensions, f_prompt) in file_types_and_prompts.items():
                if file_extension in extensions:
                    file_type, prompt = f_type, f_prompt
                    break

            if not file_type:
                return HttpResponseBadRequest("Unsupported file type.")

            # Retrieve the file path of the uploaded file
            file_path = uploaded.file.path

            # Process the file with GenAI --->
            file = upload_file(file_path)
            response = client.models.generate_content(
                model=MODEL_NAME, contents=[file, prompt]
            )
            # <-----

            uploaded.description = response.text
            uploaded.type = file_type
            uploaded.save()

            # Redirect to the preview page with the uploaded file ID
            return redirect("preview", file_id=uploaded.id)

        except Exception as e:
            # Log the error (optional) and return a generic error response
            print(f"Error processing file: {e}")
            return HttpResponseBadRequest("An error occurred while processing the file.")

    return render(request, "website/index.html", {})


def preview(request, file_id):
    try:
        uploaded_file = UploadedFile.objects.get(id=file_id)
    except UploadedFile.DoesNotExist:
        return HttpResponseBadRequest("Invalid file ID.")

    return render(request, "website/preview.html", {"file": uploaded_file})
