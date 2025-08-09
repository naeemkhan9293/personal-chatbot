import cloudinary
import cloudinary.uploader
import os
from llms.google_llms import google_llm_imagen
import uuid
import base64
from langchain_core.messages import AIMessage

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def _get_image_base64(response: AIMessage) -> str:
    image_block = next(
        (
            block
            for block in response.content
            if isinstance(block, dict) and block.get("image_url")
        ),
        None,
    )
    if image_block:
        return image_block["image_url"].get("url").split(",")[-1]
    return ""


def generate_and_upload_image(prompt: str) -> str:
    """
    Generates an image based on the prompt and uploads it to Cloudinary.
    Returns the URL of the uploaded image.
    """
    # Generate the image
    message = {
        "role": "user",
        "content": f"Generate a photorealistic image of {prompt}.",
    }
    response = google_llm_imagen.invoke(
        [message],
        generation_config=dict(response_modalities=["TEXT", "IMAGE"]),
    )
    image_base64 = _get_image_base64(response)
    image_bytes = base64.b64decode(image_base64)

    # Upload the image to Cloudinary
    public_id = f"generated_images/{uuid.uuid4()}"
    upload_result = cloudinary.uploader.upload(
        image_bytes,
        public_id=public_id,
        overwrite=True,
        resource_type="image",
    )

    return upload_result["secure_url"]
