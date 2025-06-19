"""
Advanced Personal Assistant UI

This module implements the desktop UI for the personal assistant using CustomTkinter.
"""
import customtkinter as ctk

from components.sidebar import SideBar
from components.chat_screen import ChatScreen
from components.history_screen import HistoryScreen


class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Personal Assistant")
        self.geometry("1100x750")
        self.state('zoomed') 

        # Configure grid weights to make the window responsive
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        self.sidebar = SideBar(self, width=300) # 'self' (App instance) is passed as master
        self.sidebar.grid(row=0, column=0, rowspan=4, sticky="nsew")

        self.main_frame = ctk.CTkFrame(self)
        self.main_frame.grid(row=0, column=1, padx=2, pady=0, sticky="nsew")

        # Configure main frame grid weights
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)

        self.frames = {}
        for F in (ChatScreen, HistoryScreen):
            frame = F(self.main_frame) # Screens are children of main_frame
            self.frames[F] = frame
            frame.grid(row=0, column=0, sticky="nsew") # Grid all frames in the same cell

        self.show_frame(ChatScreen) # Show ChatScreen by default

    def show_frame(self, frame_class):
        """Shows the specified frame by raising it."""
        frame = self.frames[frame_class]
        frame.tkraise()

    def show_chat_screen(self):
        self.show_frame(ChatScreen)

    def show_history_screen(self):
        self.show_frame(HistoryScreen)


if __name__ == "__main__":
    app = App()
    app.mainloop()
