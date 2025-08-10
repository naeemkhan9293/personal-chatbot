from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Any

# Create a thread pool with a specified number of worker threads
# This allows tasks to be executed concurrently in the background
executor = ThreadPoolExecutor(max_workers=5)

def submit_task(func: Callable[..., Any], callback: Callable[[Any], None], *args: Any, **kwargs: Any):
    """
    Submits a function to be executed in the background and attaches a callback.
    
    Args:
        func: The function to execute in the background.
        callback: The function to call with the result of `func` when it completes.
        *args: Positional arguments to pass to `func`.
        **kwargs: Keyword arguments to pass to `func`.
    """
    # Submit the function to the executor
    future = executor.submit(func, *args, **kwargs)
    
    # Add a callback to be executed when the future is complete
    future.add_done_callback(callback)
