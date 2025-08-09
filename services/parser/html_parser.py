import re
from bs4 import BeautifulSoup

def parse_html_to_text(html_content: str) -> str:
    """
    Parses HTML content and extracts clean, readable text.
    """
    if not html_content:
        return "No HTML content to parse."

    try:
        soup = BeautifulSoup(html_content, 'lxml')

        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        # Get text and clean up whitespace
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = '\n'.join(chunk for chunk in chunks if chunk)

        return clean_text
    except Exception as e:
        return f"An error occurred during parsing: {e}"
