from fastapi import APIRouter, UploadFile, File, Form
from api.core.gemini import GeminiHandler
from api.core.schemas import ChatSessionRequest
import uuid

router = APIRouter(prefix="/chat", tags=["Chat"])
gemini = GeminiHandler()

@router.post("/start-session")
async def start_session():
    session_id = str(uuid.uuid4())
    gemini.start_chat_session(session_id)
    return {"session_id": session_id}

@router.post("")
async def chat_interaction(
    session_id: str = Form(...),  # Get from form-data
    input_text: str = Form(None),
    image: UploadFile = File(None)
):
    image_bytes = await image.read() if image else None
    response_chunks = gemini.chat_response(session_id, input_text, image_bytes)
    return {"response": response_chunks}