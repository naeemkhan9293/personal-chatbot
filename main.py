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

def run_cli():
    """Run the application in CLI mode."""
    # Implement CLI logic or remove if not needed
    print("CLI mode is not implemented.")

# Placeholder for desktop UI launch
# You can implement your CustomTkinter UI here

def run_desktop():
    """Run the application in Desktop UI mode (CustomTkinter)."""
    try:
        # Ensure 'ui' directory is in sys.path for direct script execution
        import sys, os
        ui_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ui')
        if ui_path not in sys.path:
            sys.path.insert(0, ui_path)
        from ui.app import main as run_ui
        run_ui()
    except ImportError as e:
        print(f"Error loading UI: {e}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Advanced Personal Assistant")
    parser.add_argument(
        "--mode", 
        type=str, 
        choices=["desktop", "cli"], 
        default="desktop",
        help="Run mode: 'desktop' for CustomTkinter UI, 'cli' for command line interface"
    )
    
    args = parser.parse_args()
    
    if args.mode == "cli":
        run_cli()
    else:
        run_desktop()