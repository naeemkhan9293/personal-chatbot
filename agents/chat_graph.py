from memory.agents_memory import AgentState
from langgraph.graph import StateGraph, START, END
from node.process_chat import process_chat
from langchain_core.messages import HumanMessage

chat_graph = StateGraph(AgentState)
chat_graph.add_node("process_chat", process_chat)
chat_graph.add_edge(START, "process_chat")
chat_graph.add_edge("process_chat", END)

chat_agent = chat_graph.compile()
conversation_history = []


def update_conversation_history(message: str):
    global conversation_history
    conversation_history.append(HumanMessage(content=message))
    result = chat_agent.invoke({"messages": conversation_history})
    conversation_history = result["messages"]
