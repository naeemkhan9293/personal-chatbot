from typing import TypedDict, List, Union, Optional
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


class AgentState(TypedDict):
    chat_id: str
    messages: List[Union[SystemMessage, HumanMessage, AIMessage]]
    tools: List[str]
    memory: List[str]
    scraped_data: Optional[str]
