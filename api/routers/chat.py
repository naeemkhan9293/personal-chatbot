from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid

from agents.chat_graph import update_conversation_history, get_conversation_history
from db.repository import store_messages, get_messages, get_all_chats

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

@router.post("/")
async def chat_endpoint(chat_request: ChatRequest):
    if chat_request.chat_id is None:
        chat_request.chat_id = str(uuid.uuid4())
    update_conversation_history(chat_request.chat_id, chat_request.message)
    conversation_history = get_conversation_history(chat_request.chat_id)
    await store_messages(chat_request.chat_id, conversation_history)
    return {"response": conversation_history, "chat_id": chat_request.chat_id}

@router.get("/{chat_id}")
async def get_chat_history(chat_id: str):
    print(chat_id)
    messages = await get_messages(chat_id)
    return {"messages": messages}

@router.get("/")
async def get_all_chats_endpoint():
    chats = await get_all_chats()
    return {"chats": chats}
