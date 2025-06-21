import customtkinter as ctk
from customtkinter import CTkImage
from PIL import Image
import os
from components.tooltip import Tooltip
from agents.chat_graph import update_conversation_history
from components.conversation_history_display import ConversationHistoryDisplay
import threading




class ChatScreen(ctk.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=0)

        # Conversation history display
        self.history_display = ConversationHistoryDisplay(self)
        self.history_display.grid(row=0, column=0, padx=20, pady=(20, 10), sticky="nsew")

        # --- Input Area Frame ---
        input_frame = ctk.CTkFrame(self, fg_color="transparent")
        input_frame.grid(row=1, column=0, padx=20, pady=(5, 20), sticky="ew")

        input_frame.grid_columnconfigure(1, weight=1)

        # --- Load Send Icon ---
        # Construct path relative to this file's location
        current_dir = os.path.dirname(os.path.abspath(__file__))
        send_icon_path = os.path.join(
            current_dir, "..", "assets", "icons", "paper_plane.png"  
        )
        attachment_icon_path = os.path.join(
            current_dir, "..", "assets", "icons", "attachment.png"
        )

        send_icon_pil = Image.open(send_icon_path)
        self.send_icon_pil = CTkImage(
            light_image=send_icon_pil, dark_image=send_icon_pil, size=(24, 24)
        )

        attach_icon_pil = Image.open(attachment_icon_path)
        self.attach_icon_pil = CTkImage(
            light_image=attach_icon_pil, dark_image=attach_icon_pil, size=(24, 24)
        )

        # "Linked Docs" button
        self.linked_docs_button = ctk.CTkButton(
            input_frame, text="", height=40, width=40, image=self.attach_icon_pil
        )
        self.linked_docs_button.grid(row=0, column=0, padx=(0, 5), sticky="w")
        Tooltip(self.linked_docs_button, "Attach files or link documents")

        # Input field
        self.chat_input = ctk.CTkEntry(
            input_frame, placeholder_text="Type your message here...", height=40,

        )
        self.chat_input.grid(row=0, column=1, sticky="ew")

        # "Send" button
        self.send_button = ctk.CTkButton(
            input_frame,
            text="",
            image=self.send_icon_pil,
            width=50,
            height=40,
            command=self.send_message 
        )
        self.send_button.grid(row=0, column=2, padx=(5, 0), sticky="e")
        Tooltip(self.send_button, "Send message")

        # Bind Enter key to send_message method for the chat_input
        self.chat_input.bind("<Return>", self.send_message)

    def send_message(self, event=None): # event=None is to handle the event passed by bind
        message_text = self.chat_input.get()
        if message_text.strip(): # Check if the message is not just whitespace
            print(f"Sending message: {message_text}")
            threading.Thread(target=self._process_message, args=(message_text,), daemon=True).start()
            self.chat_input.delete(0, ctk.END) 
        else:
            print("Message is empty.")

    def _process_message(self, message_text):
        from agents.chat_graph import update_conversation_history
        update_conversation_history(message_text)
        self.after(0, self.history_display.update_display)
