from PIL import Image
import customtkinter as ctk

def make_white_icon(path, size=(30, 30)):
    """Convert a black PNG icon to white, preserving transparency."""
    img = Image.open(path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # Change dark (black) pixels to white
        if item[0] < 60 and item[1] < 60 and item[2] < 60:
            new_data.append((255, 255, 255, item[3]))  # White, keep alpha
        else:
            new_data.append(item)
    img.putdata(new_data)
    return ctk.CTkImage(img.resize(size, Image.Resampling.LANCZOS), size=size)
