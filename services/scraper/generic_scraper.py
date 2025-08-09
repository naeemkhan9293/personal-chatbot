from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

def scrape_website(url: str) -> str:
    """
    Scrapes the text content of a website using Selenium.
    """
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Edge(options=options)
    
    try:
        driver.get(url)
        # A simple way to get all visible text. 
        # For more complex sites, more specific element selection would be needed.
        body = driver.find_element(By.TAG_NAME, "body")
        return body.text
    finally:
        driver.quit()
