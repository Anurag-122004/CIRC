from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from api.core.gemini import GeminiHandler
from api.core.database import save_message, get_chat_history
import uuid

router = APIRouter(prefix="/chat", tags=["Chat"])
gemini = GeminiHandler()
active_connections = {}

@router.post("/start-session")
async def start_session():
    session_id = str(uuid.uuid4())
    gemini.start_chat_session(session_id)  # ✅ Ensure session is created in GeminiHandler
    return {"session_id": session_id}

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket

    # ✅ Send chat history to frontend
    messages = await get_chat_history(session_id)
    for msg in messages:
        await websocket.send_json(msg)

    try:
        while True:
            input_text = await websocket.receive_text()
            response = gemini.chat_response(session_id, input_text)  # ✅ Now always valid

            await save_message(session_id, input_text, response)  # ✅ Store in DB
            await websocket.send_json({"user": input_text, "bot": response})
    except WebSocketDisconnect:
        if session_id in active_connections:
            del active_connections[session_id]
