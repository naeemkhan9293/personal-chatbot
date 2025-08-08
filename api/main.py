# e:/work-profile/personal-assistant/api/main.py

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from typing import Optional
import uuid
from contextlib import asynccontextmanager
import logging

# Import the lifespan functions and the db getter
from db.db import connect_to_mongo, close_mongo_connection, get_database
from agents.chat_graph import update_conversation_history, get_conversation_history
from db.repository import store_messages, get_messages
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context manager for the application's lifespan.
    Connects to the database on startup and closes the connection on shutdown.
    """
    logger.info("Application startup...")
    connect_to_mongo()
    yield
    logger.info("Application shutdown...")
    close_mongo_connection()

# Pass the lifespan manager to the FastAPI app
app = FastAPI(lifespan=lifespan)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error for request: {request.method} {request.url}")
    logger.error(f"Request body: {await request.body()}")
    logger.error(f"Validation errors: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"An unexpected error occurred for request: {request.method} {request.url}")
    logger.error(f"Error: {exc}")
    import traceback
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from typing import Optional
import uuid

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

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
    if chat_request.chat_id is None:
        chat_request.chat_id = str(uuid.uuid4())
    update_conversation_history(chat_request.chat_id, chat_request.message)
    conversation_history = get_conversation_history(chat_request.chat_id)
    await store_messages(chat_request.chat_id, conversation_history)
    return {"response": conversation_history, "chat_id": chat_request.chat_id}

@app.get("/chat/{chat_id}")
async def get_chat_history(chat_id: str):
    print(chat_id)
    messages = await get_messages(chat_id)
    return {"messages": messages}
