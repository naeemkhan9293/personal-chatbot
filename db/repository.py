
from .db import get_database
from langchain_core.messages import HumanMessage, AIMessage
import datetime

def _message_to_dict(message):
    if isinstance(message, HumanMessage):
        return {"type": "human", "content": message.content}
    elif isinstance(message, AIMessage):
        return {"type": "ai", "content": message.content}
    else:
        return {"type": "unknown", "content": str(message)}

async def store_messages(chat_id: str, messages: list):
    """
    Stores a list of messages for a given chat ID in the database.
    This will overwrite any existing messages for the given chat_id.
    """
    db = get_database()
    collection = db.conversations
    
    message_dicts = [_message_to_dict(m) for m in messages]
    
    await collection.update_one(
        {"_id": chat_id},
        {
            "$set": {
                "messages": message_dicts,
                "last_updated": datetime.datetime.utcnow()
            }
        },
        upsert=True
    )

async def get_messages(chat_id: str) -> list:
    """
    Retrieves messages for a given chat ID from the database.
    """
    db = get_database()
    collection = db.conversations
    
    document = await collection.find_one({"_id": chat_id})
    
    if document:
        return document.get("messages", [])
    return []
