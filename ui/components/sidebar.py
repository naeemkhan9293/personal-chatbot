import customtkinter as ctk


class SideBar(ctk.CTkFrame):
    def __init__(self, master, *args, # master is the App instance
                 width: int = 100,
                 height: int = 32,
                 **kwargs):
        super().__init__(master, *args, width=width, height=height, **kwargs)
        # self.master refers to the App instance

        # Configure the frame to maintain its width
        self.grid_propagate(False)

        # Configure grid to expand content properly
        self.grid_columnconfigure(0, weight=1)

        # Add button
        new_chat_button = ctk.CTkButton(self, text="New Chat", corner_radius=0,
                                        command=self.master.show_chat_screen)
        new_chat_button.grid(row=0, column=0,  pady=1, sticky="ew")

        history_button = ctk.CTkButton(self, text="History", corner_radius=0,
                                         command=self.master.show_history_screen)
        history_button.grid(row=1, column=0,  pady=1, sticky="ew")
    