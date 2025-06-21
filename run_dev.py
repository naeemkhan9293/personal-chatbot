import subprocess
import time
from watchgod import watch
import sys 
import os 

app_dir = 'e:/work-profile/personal-assistant' # Define the application directory
def run_server():
    """Starts the main application."""
    main_script_path = os.path.join(app_dir, 'main.py')

    # Run main.py with its own directory as the current working directory (cwd)
    process = subprocess.Popen([sys.executable, main_script_path], cwd=app_dir)
    return process

def main():
    process = run_server()
    print(f"Watching for file changes in {app_dir}")
    # Watch the specific project directory
    for changes in watch(app_dir):
        print("Changes detected:", changes)
        print("Restarting application...")
        process.terminate() # Terminate the old process
        process.wait()      # Wait for it to terminate
        process = run_server() # Start a new one
        time.sleep(1) # Short delay to ensure process starts

if __name__ == "__main__":
    main()