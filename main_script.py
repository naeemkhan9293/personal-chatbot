#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Advanced Personal Assistant

This is the main entry point for the personal assistant application.
It initializes all necessary components and starts the application.
"""
import os
import sys
import subprocess
import time
import signal
import logging
from dotenv import load_dotenv
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Add the project root to sys.path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class ServerChangeHandler(FileSystemEventHandler):
    """Restarts the server when a Python file is modified."""
    def __init__(self):
        self.process = None
        self.start_server()

    def start_server(self):
        if self.process:
            logger.info("Terminating existing server...")
            self.process.terminate()
            self.process.wait()
        logger.info("Starting FastAPI server...")
        self.process = subprocess.Popen(
            [sys.executable, '-m', 'uvicorn', 'api.main:app']
        )

    def on_modified(self, event):
        if event.src_path.endswith(".py"):
            logger.info(f"Detected change in {event.src_path}. Reloading server...")
            self.start_server()

def run_full_stack():
    """Run both FastAPI backend (with auto-reload) and Remix frontend in parallel."""
    
    # --- FastAPI Server with Watchdog ---
    event_handler = ServerChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=PROJECT_ROOT, recursive=True)
    observer.start()

    # --- Remix Frontend Server ---
    remix_proc = None
    try:
        logger.info("Starting Remix development server...")
        remix_proc = subprocess.Popen(
            'npm run dev',
            cwd=os.path.join(PROJECT_ROOT, 'chat_ui'),
            shell=True
        )
    except FileNotFoundError:
        logger.error("Error: 'npm' command not found. Please ensure Node.js is installed.")
        observer.stop()
        observer.join()
        if event_handler.process:
            event_handler.process.terminate()
        sys.exit(1)

    # --- Graceful Shutdown ---
    def shutdown(sig, frame):
        print() # Newline for cleaner exit
        logger.info("Shutting down servers...")
        observer.stop()
        observer.join()
        if event_handler.process:
            event_handler.process.terminate()
        if remix_proc:
            remix_proc.terminate()
        if event_handler.process:
            event_handler.process.wait()
        if remix_proc:
            remix_proc.wait()
        logger.info("Shutdown complete.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown(None, None)

if __name__ == "__main__":
    run_full_stack()
