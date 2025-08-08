from memory.agents_memory import AgentState
from langgraph.graph import StateGraph, START, END
from node.process_chat import process_chat
from langchain_core.messages import HumanMessage, AIMessage

chat_graph = StateGraph(AgentState)
chat_graph.add_node("process_chat", process_chat)
chat_graph.add_edge(START, "process_chat")
chat_graph.add_edge("process_chat", END)

chat_agent = chat_graph.compile()
conversation_histories = {}

def get_conversation_history(chat_id: str) -> list:
    return conversation_histories.get(chat_id, [])

def update_conversation_history(chat_id: str, message: str):
    if chat_id not in conversation_histories:
        conversation_histories[chat_id] = []
    
    conversation_histories[chat_id].append(HumanMessage(content=message))
    result = chat_agent.invoke({"messages": conversation_histories[chat_id]})
    conversation_histories[chat_id] = result["messages"]
