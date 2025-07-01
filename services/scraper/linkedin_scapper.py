from selenium import webdriver
from selenium.webdriver.edge.options import Options

opt = Options()
opt.add_experimental_option("debuggerAddress", "localhost:9222")

driver = webdriver.Edge(options=opt)

driver.get("https://www.linkedin.com/feed/")