from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import vision, chat
from api.core.database import database

app = FastAPI()

# ✅ Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_db_client():
    await database.client.start_session()

@app.on_event("shutdown")
async def shutdown_db_client():
    await database.client.close()

@app.get("/")
def read_root():
    return {"status": "API is running"}
