import motor.motor_tornado
import os
from dotenv import load_dotenv

# These will hold the client and database instances
db_client = None
db = None
load_dotenv()

def connect_to_mongo():
    """Establishes the connection to MongoDB."""
    global db_client, db
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        raise ValueError("No MONGO_URI found in environment variables")
    
    print("Connecting to MongoDB...")
    db_client = motor.motor_tornado.MotorClient(MONGO_URI)
    db = db_client.personal_assistant
    print("MongoDB connected.")

def close_mongo_connection():
    """Closes the connection to MongoDB."""
    global db_client
    if db_client:
        print("Closing MongoDB connection...")
        db_client.close()
        print("MongoDB connection closed.")

def get_database():
    """Returns the database instance."""
    if db is None:
        raise RuntimeError("Database connection has not been established.")
    return db