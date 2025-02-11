import os
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv
import io

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GeminiHandler:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.chat_sessions = {}

    def get_response(self, input_text: str = None, image_bytes: bytes = None):
        # Ensure the request has at least a text input
        # if not input_text:
        #     raise ValueError("Input text is required for Gemini API")

        # Process image if provided
        image = Image.open(io.BytesIO(image_bytes)) if image_bytes else None

        # Send appropriate request based on input type
        if image:
            response = self.model.generate_content([input_text, image])
        else:
            response = self.model.generate_content(input_text)

        return response.text

    def start_chat_session(self, session_id: str):
        self.chat_sessions[session_id] = self.model.start_chat(history=[])

    def chat_response(self, session_id: str, input_text: str = None, image_bytes: bytes = None):
        if session_id not in self.chat_sessions:
            raise ValueError("Invalid session ID")

        chat = self.chat_sessions[session_id]
        image = Image.open(io.BytesIO(image_bytes)) if image_bytes else None

        if not input_text:
            raise ValueError("Input text is required for chat interaction")

        if image:
            response = chat.send_message([input_text, image], stream=True)
        else:
            response = chat.send_message(input_text, stream=True)

        return [chunk.text for chunk in response]
