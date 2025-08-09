import time
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from services.parser.html_parser import parse_html_to_text

def scrape_website(url: str) -> str:
    """
    Scrapes and parses a website, returning clean text.
    """
    driver = None
    try:
        options = uc.ChromeOptions()
        driver = uc.Chrome(options=options, use_subprocess=True, version_main=138)
        
        print("Navigating to URL...")
        driver.get(url)
        
        print("Waiting 15 seconds for bot detection challenges...")
        time.sleep(15)
        
        print("Capturing full HTML.")
        html_content = driver.page_source
        return parse_html_to_text(html_content)
        
    except Exception as e:
        print(f"An error occurred: {e}. Parsing any available HTML.")
        if driver:
            partial_html = driver.page_source
            return parse_html_to_text(partial_html)
        return f"An error occurred and could not retrieve any HTML: {e}"
    finally:
        if driver:
            print("Closing browser.")
            driver.quit()
