from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.routes import vision, chat
from api.core.database import database

# ✅ Define lifespan for FastAPI (handles startup & shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.client.start_session()  # Start DB session
    yield
    await database.client.close()  # Close DB session

app = FastAPI(lifespan=lifespan)

# ✅ Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://project-rho-fawn.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "API is running"}
