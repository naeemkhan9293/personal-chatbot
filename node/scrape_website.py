import re
from memory.agents_memory import AgentState
from services.scraper.generic_scraper import scrape_website

def scrape_website_node(state: AgentState) -> AgentState:
    """
    Scrapes a website and adds the content to the agent's state.
    """
    last_message = state["messages"][-1].content
    
    # Find the URL in the message using a regular expression
    url_match = re.search(r"https?://\S+", last_message)
    
    if url_match:
        url = url_match.group(0)
        scraped_text = scrape_website(url)
        state["scraped_data"] = scraped_text
    else:
        state["scraped_data"] = "No URL found in the message."
    
    return state
