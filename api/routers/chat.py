from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid

from agents.chat_graph import update_conversation_history, get_conversation_history, load_conversation_history
from db.repository import store_messages, get_messages, get_all_chats, update_message_status
from langchain_core.messages import HumanMessage, AIMessage
from services.scraper.generic_scraper import scrape_website

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

def _message_to_dict(message):
    message_dict = {}
    if isinstance(message, HumanMessage):
        message_dict = {"type": "human", "content": message.content}
    elif isinstance(message, AIMessage):
        message_dict = {"type": "ai", "content": message.content}
        if "image_url" in message.additional_kwargs:
            message_dict["image_url"] = message.additional_kwargs["image_url"]
    else:
        # Handle other types if necessary, or return a default
        return None

    if hasattr(message, 'status'):
        message_dict['status'] = message.status
    if hasattr(message, 'result'):
        message_dict['result'] = message.result
        
    return message_dict

def _dict_to_message(message_dict):
    msg_type = message_dict.get('type')
    content = message_dict.get('content')

    if msg_type == 'human':
        message = HumanMessage(content=content)
    elif msg_type == 'ai':
        additional_kwargs = {}
        if "image_url" in message_dict:
            additional_kwargs["image_url"] = message_dict["image_url"]
        message = AIMessage(content=content, additional_kwargs=additional_kwargs)
    else:
        return None

    if 'status' in message_dict:
        message.status = message_dict['status']
    if 'result' in message_dict:
        message.result = message_dict['result']
        
    return message

async def run_scraping_and_update(chat_id: str, message_content: str, url: str):
    scraped_data = scrape_website(url)
    await update_message_status(chat_id, message_content, "complete", scraped_data)

@router.post("/")
async def chat_endpoint(chat_request: ChatRequest, background_tasks: BackgroundTasks):
    if chat_request.chat_id:
        # Load existing history from DB
        existing_messages_dicts = await get_messages(chat_request.chat_id)
        if existing_messages_dicts:
            existing_messages = [msg for msg in [_dict_to_message(m) for m in existing_messages_dicts] if msg is not None]
            load_conversation_history(chat_request.chat_id, existing_messages)
    else:
        chat_request.chat_id = str(uuid.uuid4())

    if chat_request.message.startswith("/scrape website"):
        url = chat_request.message.replace("/scrape website", "").strip()
        
        # Create a new HumanMessage with a "processing" status
        processing_message = HumanMessage(content=chat_request.message)
        processing_message.status = "processing"
        
        # Update conversation history
        conversation_history = get_conversation_history(chat_request.chat_id)
        conversation_history.append(processing_message)
        
        # Store the updated history
        await store_messages(chat_request.chat_id, conversation_history)
        
        # Add the scraping task to background
        background_tasks.add_task(run_scraping_and_update, chat_request.chat_id, chat_request.message, url)
        
        # Return an immediate response
        ai_response = AIMessage(content=f"Scraping for {url} has started in the background.")
        return {"response": _message_to_dict(ai_response), "chat_id": chat_request.chat_id}

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
