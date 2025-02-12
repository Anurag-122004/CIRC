from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from api.core.gemini import GeminiHandler
import uuid

router = APIRouter(prefix="/chat", tags=["Chat"])
gemini = GeminiHandler()

# ✅ Add the missing POST route for session start
@router.post("/start-session")
async def start_session():
    session_id = str(uuid.uuid4())
    gemini.start_chat_session(session_id)
    return {"session_id": session_id}

# Store active WebSocket connections
active_connections = {}

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    gemini.start_chat_session(session_id)  # Start chat session when WebSocket connects

    try:
        while True:
            input_text = await websocket.receive_text()
            response = gemini.chat_response(session_id, input_text)
            await websocket.send_json({"user": input_text, "bot": response})
    except WebSocketDisconnect:
        del active_connections[session_id]  # Remove disconnected session
