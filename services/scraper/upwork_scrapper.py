import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def scrape_upwork_profile(url: str) -> str:
    """
    Scrapes an Upwork profile by attaching to an existing user-controlled Chrome browser.
    """
    options = Options()
    # This connects to a Chrome browser instance you have already opened with a debugging port
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get(url)
        # The user is expected to have the correct page open.
        # The script will wait for the necessary elements to appear.
        wait = WebDriverWait(driver, 45)
        
        title_selector = "h1"
        description_selector = "[data-qa='project-description']"
        
        title_element = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, title_selector)))
        title = title_element.text
        
        description_element = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, description_selector)))
        description = description_element.text
        
        scraped_data = f"Title: {title}\n\nDescription:\n{description}"
        
        return scraped_data
        
    except TimeoutException:
        return "Timed out waiting for page elements. Please ensure you are on the correct Upwork page before running the script."
    except Exception as e:
        if "invalid session id" in str(e):
            return "Could not connect to the browser. Please ensure you have launched Chrome with the debugging port open."
        return f"An error occurred while scraping: {e}"
    finally:
        # We don't quit the driver, as it's attached to the user's browser
        pass
