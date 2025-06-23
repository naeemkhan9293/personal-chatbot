#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Advanced Personal Assistant

This is the main entry point for the personal assistant application.
It initializes all necessary components and starts the application.
"""
import os
import sys


# Add the project root to sys.path
# This allows absolute imports from the project root (e.g., 'from agents import ...', 'from ui import ...')
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import logging
from dotenv import load_dotenv


# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def run_full_stack():
    """Run both FastAPI backend and Remix frontend in parallel."""
    import subprocess
    import threading
    import time
    import signal

    processes = []

    def run_fastapi():
        # Start FastAPI with uvicorn
        proc = subprocess.Popen([
            sys.executable, '-m', 'uvicorn', 'api.main:app', '--reload'
        ])
        processes.append(proc)
        proc.wait()

    def run_remix():
        # Start Remix app (npm run dev) in chat_ui directory
        try:
            proc = subprocess.Popen(
                'npm run dev',
                cwd=os.path.join(PROJECT_ROOT, 'chat_ui'),
                shell=True  # Needed for Windows to find npm
            )
            processes.append(proc)
            proc.wait()
        except FileNotFoundError:
            print("Error: 'npm' command not found. Please ensure Node.js and npm are installed and available in your PATH.")

    threads = [
        threading.Thread(target=run_fastapi),
        threading.Thread(target=run_remix)
    ]
    for t in threads:
        t.start()

    try:
        while any(t.is_alive() for t in threads):
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        for proc in processes:
            proc.terminate()
        for proc in processes:
            proc.wait()

if __name__ == "__main__":
    run_full_stack()