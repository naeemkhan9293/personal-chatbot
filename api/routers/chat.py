from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid

from agents.chat_graph import update_conversation_history, get_conversation_history, load_conversation_history
from db.repository import store_messages, get_messages, get_all_chats
from langchain_core.messages import HumanMessage, AIMessage

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

def _message_to_dict(message):
    if isinstance(message, HumanMessage):
        return {"type": "human", "content": message.content}
    elif isinstance(message, AIMessage):
        return {"type": "ai", "content": message.content}
    else:
        return None

def _dict_to_message(message_dict):
    if message_dict['type'] == 'human':
        return HumanMessage(content=message_dict['content'])
    elif message_dict['type'] == 'ai':
        return AIMessage(content=message_dict['content'])
    else:
        return None

@router.post("/")
async def chat_endpoint(chat_request: ChatRequest):
    if chat_request.chat_id:
        # Load existing history from DB
        existing_messages_dicts = await get_messages(chat_request.chat_id)
        if existing_messages_dicts:
            existing_messages = [_dict_to_message(m) for m in existing_messages_dicts if m]
            load_conversation_history(chat_request.chat_id, existing_messages)
    else:
        chat_request.chat_id = str(uuid.uuid4())

    update_conversation_history(chat_request.chat_id, chat_request.message)
    conversation_history = get_conversation_history(chat_request.chat_id)
    await store_messages(chat_request.chat_id, conversation_history)
    
    # Return only the last message (the AI's response)
    ai_response = conversation_history[-1] if conversation_history else None
    
    return {"response": _message_to_dict(ai_response), "chat_id": chat_request.chat_id}

@router.get("/{chat_id}")
async def get_chat_history(chat_id: str):
    messages = await get_messages(chat_id)
    return {"messages": messages}

@router.get("/")
async def get_all_chats_endpoint():
    chats = await get_all_chats()
    return {"chats": chats}
