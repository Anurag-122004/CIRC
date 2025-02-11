# api/core/schemas.py

from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile

# Request schema for Image analysis (if required)
class ImageRequest(BaseModel):
    input_text: Optional[str] = None
    image_bytes: Optional[bytes] = None

# Request schema for starting a new chat session or interacting with an existing one
class ChatSessionRequest(BaseModel):
    session_id: str
    input_text: Optional[str] = None
    image_bytes: Optional[bytes] = None
