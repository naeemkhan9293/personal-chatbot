
from .db import get_database
from langchain_core.messages import HumanMessage, AIMessage
import datetime

def _message_to_dict(message):
    if isinstance(message, HumanMessage):
        return {"type": "human", "content": message.content}
    elif isinstance(message, AIMessage):
        message_dict = {"type": "ai", "content": message.content}
        if "image_url" in message.additional_kwargs:
            message_dict["image_url"] = message.additional_kwargs["image_url"]
        return message_dict
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

async def get_all_chats() -> list:
    """
    Retrieves all chats from the database.
    """
    db = get_database()
    collection = db.conversations
    
    cursor = collection.find({}, {"_id": 1, "messages": {"$slice": 1}})
    
    chats = []
    for document in await cursor.to_list(length=100):
        chat_id = document.get("_id")
        messages = document.get("messages", [])
        first_message = messages[0] if messages else {}
        chats.append({
            "chat_id": chat_id,
            "title": first_message.get("content", "New Chat")
        })
    return chats
