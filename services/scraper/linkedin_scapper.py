from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opt = Options()

opt.add_experimental_option("debuggerAddress", "localhost:9222")

driver = webdriver.Chrome(options=opt)

driver.get("https://pk.linkedin.com/")
