import customtkinter as ctk
from agents.chat_graph import conversation_history


class ConversationHistoryDisplay(ctk.CTkScrollableFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        self.update_display()

    def update_display(self):
        # Clear previous widgets
        for widget in self.winfo_children():
            widget.destroy()

        for msg in conversation_history:
            role = getattr(msg, "role", None) or msg.__class__.__name__
            content = getattr(msg, "content", str(msg))

            is_user = role.lower() in ["humanmessage", "user"]
            prefix = "You: " if is_user else "AI: "
            full_text = prefix + content

            # Set colors and alignment
            fg_color = "#2C4056" if is_user else "#353936"
            text_color = "white"
            anchor = "e" if is_user else "w"
            rel_width = 0.5 if is_user else 1.0

            # Outer frame for alignment and width control
            outer_frame = ctk.CTkFrame(self, fg_color="transparent")
            outer_frame.pack(fill="x", padx=10, pady=4, anchor=anchor)

            # Inner label with styled bubble
            label = ctk.CTkLabel(
                outer_frame,
                text=full_text,
                justify="left",
                wraplength=int(self.winfo_width() * rel_width) or 400,
                fg_color=fg_color,
                text_color=text_color,
                corner_radius=5,
                font=ctk.CTkFont(size=14),
                anchor="w",
            )
            label.pack(
                side="right" if is_user else "left",
                padx=(15, 15) if is_user else (15, 15),
                ipadx=8,
                ipady=5,
                fill="both",
                expand=False,
            )
