from memory.agents_memory import AgentState
from llms.google_llms import google_llm
from langchain_core.messages import AIMessage



def process_chat(state: AgentState) -> AgentState:
    """This node will solve the request input by user"""
    response = google_llm.invoke(state["messages"])
    state["messages"].append(AIMessage(content=response))
    return state




