from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def scrape_website(url: str) -> str:
    """
    Scrapes a website by attaching to an existing user-controlled Chrome browser.
    """
    options = Options()
    # This connects to a Chrome browser instance you have already opened with a debugging port
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get(url)
        # The user is expected to have the correct page open.
        # The script will wait for the necessary elements to appear.
        wait = WebDriverWait(driver, 20)
        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        return body.text
        
    except TimeoutException:
        return "Timed out waiting for page elements. Please ensure you are on the correct page before running the script."
    except Exception as e:
        if "invalid session id" in str(e):
            return "Could not connect to the browser. Please ensure you have launched Chrome with the debugging port open."
        return f"An error occurred while scraping: {e}"
