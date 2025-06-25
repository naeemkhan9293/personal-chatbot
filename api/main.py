from fastapi import FastAPI
from pydantic import BaseModel
from agents.chat_graph import update_conversation_history, conversation_history

app = FastAPI()

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    update_conversation_history(chat_request.message)

    return {"response": conversation_history}


