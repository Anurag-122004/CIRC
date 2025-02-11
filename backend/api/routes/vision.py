from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from api.core.gemini import GeminiHandler

router = APIRouter()
gemini = GeminiHandler()

@router.post("/analyze-image")
async def analyze_image(
    input_text: str = Form(...),  # Ensure input_text is provided dynamically from frontend
    image: UploadFile = File(None)
):
    try:
        image_bytes = await image.read() if image else None
        response = gemini.get_response(input_text, image_bytes)
        return {"response": response}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
