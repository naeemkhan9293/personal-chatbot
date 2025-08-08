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
from fastapi.middleware.cors import CORSMiddleware
from .routers import chat

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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])

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
