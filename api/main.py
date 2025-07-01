# e:/work-profile/personal-assistant/api/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Import the lifespan functions and the db getter
from db.db import connect_to_mongo, close_mongo_connection, get_database
from agents.chat_graph import update_conversation_history, conversation_history
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager for the application's lifespan.
    Connects to the database on startup and closes the connection on shutdown.
    """
    print("Application startup...")
    connect_to_mongo()
    yield
    print("Application shutdown...")
    close_mongo_connection()

# Pass the lifespan manager to the FastAPI app
app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def read_root():
    """
    Root endpoint to check API status and database connection.
    """
    try:
        # Get the database instance
        db = get_database()
        # Perform a simple operation to verify connection, e.g., list collections
        collections = await db.list_collection_names()
        return {"status": "online", "database_status": "connected", "collections": collections}
    except Exception as e:
        print(f"Database connection error: {e}")
        return {"status": "online", "database_status": "error", "detail": str(e)}


@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    # This endpoint doesn't seem to use the database, so it remains unchanged.
    # If it needed the db, you would call get_database() inside this function.
    update_conversation_history(chat_request.message)
    return {"response": conversation_history}
