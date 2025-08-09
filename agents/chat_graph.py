from memory.agents_memory import AgentState
from langgraph.graph import StateGraph, END
from node.process_chat import process_chat
from node.generate_image import generate_image
from langchain_core.messages import HumanMessage

def should_generate_image(state: AgentState) -> str:
    """
    Determines whether to generate an image or process a regular chat message.
    """
    last_message = state["messages"][-1].content
    if last_message.startswith("/generate image"):
        return "generate_image"
    return "process_chat"

chat_graph = StateGraph(AgentState)

# Add nodes
chat_graph.add_node("process_chat", process_chat)
chat_graph.add_node("generate_image", generate_image)

# Set the conditional entry point
chat_graph.set_conditional_entry_point(
    should_generate_image,
    {
        "generate_image": "generate_image",
        "process_chat": "process_chat",
    },
)

# Add edges
chat_graph.add_edge("process_chat", END)
chat_graph.add_edge("generate_image", END)

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
    
    # Append the new human message
    current_history = conversation_histories.get(chat_id, [])
    current_history.append(HumanMessage(content=message))
    
    # Invoke the chat agent
    result = chat_agent.invoke({"messages": current_history})
    
    # Update the history with the new state from the agent
    conversation_histories[chat_id] = result["messages"]
