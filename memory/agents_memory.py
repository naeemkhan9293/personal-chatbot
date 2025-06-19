import os 
from typing import TypedDict, List, Union
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


class AgentState(TypedDict):
    messages: List[Union[SystemMessage, HumanMessage, AIMessage]]
    tools: List[str]
    memory: List[str]