import time
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from services.parser.html_parser import parse_html_to_text

def scrape_upwork_profile(url: str) -> str:
    """
    Scrapes and parses an Upwork profile, returning clean text.
    """
    driver = None
    try:
        options = uc.ChromeOptions()
        driver = uc.Chrome(options=options, use_subprocess=True, version_main=138)
        
        print("Navigating to URL...")
        driver.get(url)
        
        wait = WebDriverWait(driver, 60)
        
        print("Waiting for Cloudflare challenge to complete...")
        wait.until_not(EC.title_contains("Just a moment..."))
        print("Cloudflare challenge passed. Capturing full HTML.")

        html_content = driver.page_source
        return parse_html_to_text(html_content)
        
    except TimeoutException:
        print("Timeout occurred. Parsing partial HTML.")
        if driver:
            partial_html = driver.page_source
            return parse_html_to_text(partial_html)
        return "Timed out and could not retrieve any HTML."
    except Exception as e:
        return f"An error occurred while scraping: {e}"
    finally:
        if driver:
            print("Closing browser.")
            driver.quit()
