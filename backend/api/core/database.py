import os
import motor.motor_asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client[MONGO_DB_NAME]
chat_collection = database.get_collection("chat_messages")

# ✅ Function to save chat messages
async def save_message(session_id, user_message, bot_response):
    message_data = {
        "session_id": session_id,
        "user_message": user_message,
        "bot_response": bot_response
    }
    await chat_collection.insert_one(message_data)

# ✅ Function to retrieve chat history
async def get_chat_history(session_id):
    messages = []
    async for msg in chat_collection.find({"session_id": session_id}):
        messages.append({"user": msg["user_message"], "bot": msg["bot_response"]})
    return messages
