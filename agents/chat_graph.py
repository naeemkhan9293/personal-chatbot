from memory.agents_memory import AgentState
from langgraph.graph import StateGraph, START, END
from node.process_chat import process_chat

chat_graph = StateGraph(AgentState)
chat_graph.add_node("process_chat", process_chat)
chat_graph.add_edge(START, "process_chat")
chat_graph.add_edge("process_chat", END)

chat_agent = chat_graph.compile()


