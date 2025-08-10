from memory.agents_memory import AgentState
from langgraph.graph import StateGraph, END
from node.process_chat import process_chat
from node.generate_image import generate_image
from node.scrape_website import scrape_website_node
from langchain_core.messages import HumanMessage, SystemMessage

def route_message(state: AgentState) -> str:
    """
    Determines the appropriate node to handle the user's message.
    """
    last_message = state["messages"][-1].content
    print(last_message)
    if "/generate image" in last_message:
        return "generate_image"
    if "/scrape website" in last_message:
        return "scrape_website"
    return "process_chat"

chat_graph = StateGraph(AgentState)

# Add nodes
chat_graph.add_node("process_chat", process_chat)
chat_graph.add_node("generate_image", generate_image)
chat_graph.add_node("scrape_website", scrape_website_node)

# Set the conditional entry point
chat_graph.set_conditional_entry_point(
    route_message,
    {
        "generate_image": "generate_image",
        "scrape_website": "scrape_website",
        "process_chat": "process_chat",
    },
)

# Add edges
chat_graph.add_edge("process_chat", END)
chat_graph.add_edge("generate_image", END)
chat_graph.add_edge("scrape_website", END)

chat_agent = chat_graph.compile()
conversation_histories = {}

def get_conversation_history(chat_id: str) -> list:
    return conversation_histories.get(chat_id, [])

def load_conversation_history(chat_id: str, messages: list):
    """Loads existing messages into the conversation history."""
    conversation_histories[chat_id] = messages

def update_conversation_history(chat_id: str, message: str):
    if chat_id not in conversation_histories:
        conversation_histories[chat_id] = []
    
    current_history = conversation_histories.get(chat_id, [])
    current_history.append(HumanMessage(content=message))
    
    # Invoke the chat agent with the chat_id
    result = chat_agent.invoke({"messages": current_history, "chat_id": chat_id})
    
    conversation_histories[chat_id] = result["messages"]

    if result.get("scraped_data"):
        conversation_histories[chat_id].append(SystemMessage(content=result["scraped_data"]))

def update_conversation_with_scraped_data(chat_id: str, scraped_text: str):
    """
    Updates the conversation history with the scraped data.
    """
    if chat_id in conversation_histories:
        conversation_histories[chat_id].append(SystemMessage(content=scraped_text))
    else:
        print(f"Chat ID {chat_id} not found in conversation histories.")
