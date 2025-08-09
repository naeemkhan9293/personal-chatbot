from memory.agents_memory import AgentState
from services.image_generator.image_generator import generate_and_upload_image
from langchain_core.messages import AIMessage

def generate_image(state: AgentState) -> AgentState:
    """
    This node generates an image based on the user's prompt,
    uploads it, and adds the image URL to the state.
    """
    # The prompt is the content of the last message
    prompt = state["messages"][-1].content
    
    # The command is "/generate image ", so we remove it to get the actual prompt
    clean_prompt = prompt.replace("/generate image", "").strip()
    
    # Generate and upload the image
    image_url = generate_and_upload_image(clean_prompt)
    
    # Create a new AI message with the image URL
    response_message = f"Generated image based on your prompt: {clean_prompt}"
    
    # We add the image_url to the additional_kwargs so it can be stored and displayed
    ai_message = AIMessage(
        content=response_message,
        additional_kwargs={"image_url": image_url}
    )
    
    state["messages"].append(ai_message)
    
    return state
