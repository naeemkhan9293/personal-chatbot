import sys
import os
import re

# Add project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from memory.agents_memory import AgentState
from services.scraper.generic_scraper import scrape_website
from services.scraper.upwork_scrapper import scrape_upwork_profile
from services.background_tasks import submit_task

def scrape_website_node(state: AgentState) -> AgentState:
    """
    Submits a website to be scraped in the background.
    """
    chat_id = state["chat_id"]
    last_message = state["messages"][-1].content
    
    url_match = re.search(r"https?://\S+", last_message)
    
    if url_match:
        url = url_match.group(0)
        
        # Define the callback function to handle the result
        def on_scraping_complete(future):
            from agents.chat_graph import update_conversation_with_scraped_data
            try:
                scraped_text = future.result()
                update_conversation_with_scraped_data(chat_id, scraped_text)
            except Exception as e:
                update_conversation_with_scraped_data(chat_id, f"An error occurred: {e}")

        # Determine which scraper to use
        scraper_function = scrape_upwork_profile if "upwork.com" in url else scrape_website
        
        # Submit the scraping task to the background
        submit_task(scraper_function, on_scraping_complete, url)
        
        # Immediately return a message indicating that scraping is in progress
        state["scraped_data"] = "Processing... scraping in progress."
    else:
        state["scraped_data"] = "No URL found in the message."
    
    return state
