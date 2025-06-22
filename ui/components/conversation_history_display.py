# import customtkinter as ctk
# from agents.chat_graph import conversation_history
# from utils.convert_icons_color import make_white_icon

# class ConversationHistoryDisplay(ctk.CTkScrollableFrame):
#     def __init__(self, master, **kwargs):
#         super().__init__(master, **kwargs)

#         # Load and whiten icons - paths should be correct in your environment
#         self.user_icon = make_white_icon("ui/assets/icons/user.png", size=(30,30))
#         self.bot_icon = make_white_icon("ui/assets/icons/robot.png", size=(30,30))

#         self.update_display()

#     def update_display(self):
#         # Clear previous messages
#         for widget in self.winfo_children():
#             widget.destroy()

#         if not conversation_history: # Handle case with no history
#             no_history_label = ctk.CTkLabel(self, text="No messages yet.", font=ctk.CTkFont(size=14))
#             no_history_label.pack(pady=20)
#             return

#         for msg_idx, msg in enumerate(conversation_history):
#             role = getattr(msg, "role", None) or msg.__class__.__name__
#             content = getattr(msg, "content", str(msg))
#             is_user = role.lower() in ["humanmessage", "user"]
#             full_text = content

#             # Styling
#             fg_color = "#2C4056" if is_user else "#353936"
#             text_color = "white"
#             outer_frame_content_anchor = "e" if is_user else "w"

#             # Message wrapper frame
#             outer_frame = ctk.CTkFrame(self, fg_color="transparent")
#             outer_frame.pack(
#                 fill="x",
#                 padx=10,
#                 pady=6,
#                 anchor=outer_frame_content_anchor
#             )

#             # Avatar icon
#             icon_label = ctk.CTkLabel(
#                 outer_frame,
#                 image=self.user_icon if is_user else self.bot_icon,
#                 text=""
#             )

#             # Determine wraplength for the message bubble
#             parent_width = self.winfo_width()
#             if parent_width <= 1:
#                 parent_width = self.cget("width") if self.cget("width") > 1 else 600

#             rel_width = 0.60 if is_user else 0.85
#             wraplength_val = int(parent_width * rel_width)
#             wraplength_val = max(wraplength_val, 150)

#             # Message bubble
#             label = ctk.CTkLabel(
#                 outer_frame,
#                 text=full_text,
#                 justify="left",
#                 wraplength=wraplength_val,
#                 fg_color=fg_color,
#                 text_color=text_color,
#                 corner_radius=8,
#                 font=ctk.CTkFont(size=14),
#                 anchor="w"
#             )

#             # Packing order and alignment for top-corner icons
#             if is_user:
#                 icon_label.pack(
#                     side="right",
#                     padx=(10, 6),
#                     pady=(5, 0), # Top padding, no bottom padding
#                     anchor="ne"   # Align to North-East (top-right)
#                 )
#                 label.pack(
#                     side="right",
#                     padx=(6, 10),
#                     ipady=8,
#                     pady=(5, 0), # Top padding, no bottom padding
#                     fill="x",     # Fill horizontally only
#                     expand=False,
#                     anchor="ne"   # Align to North-East
#                 )
#             else:
#                 icon_label.pack(
#                     side="left",
#                     padx=(6, 10),
#                     pady=(5, 0), # Top padding, no bottom padding
#                     anchor="nw"   # Align to North-West (top-left)
#                 )
#                 label.pack(
#                     side="left",
#                     padx=(10, 6),
#                     ipady=8,
#                     pady=(5, 0), # Top padding, no bottom padding
#                     fill="x",     # Fill horizontally only
#                     expand=False,
#                     anchor="nw"   # Align to North-West
#                 )
        
#         # Scroll to bottom to show the latest message
#         if conversation_history:
#              self.after(100, lambda: self._parent_canvas.yview_moveto(1.0))

import customtkinter as ctk
import tkinter as tk
import tkinter.font as tkFont
from agents.chat_graph import conversation_history
from utils.convert_icons_color import make_white_icon

class ConversationHistoryDisplay(ctk.CTkScrollableFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        # Load icons
        self.user_icon = make_white_icon("ui/assets/icons/user.png", size=(30,30))
        self.bot_icon = make_white_icon("ui/assets/icons/robot.png", size=(30,30))

        # Keep track of copy buttons if needed
        self._copy_buttons = []

        self.update_display()

    def copy_to_clipboard(self, text, button_widget=None):
        toplevel = self.winfo_toplevel()
        toplevel.clipboard_clear()
        toplevel.clipboard_append(text)
        if button_widget:
            orig_text = button_widget.cget("text")
            button_widget.configure(text="Copied!")
            button_widget.after(1000, lambda: button_widget.configure(text=orig_text))

    def _on_textbox_mousewheel(self, event):
        """
        Redirect mouse-wheel scrolling to the outer scrollable frame's canvas,
        so the textbox itself does not scroll vertically.
        """
        # Depending on platform, event.delta may differ; standard Windows: delta is multiple of 120
        # For Linux/Mac adjustments may be needed, but this covers common Windows case.
        # Negative to scroll in the natural direction.
        self._parent_canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        # Prevent default textbox scrolling
        return "break"

    def update_display(self):
        # Clear previous messages
        for widget in self.winfo_children():
            widget.destroy()
        self._copy_buttons.clear()

        if not conversation_history:
            no_history_label = ctk.CTkLabel(self, text="No messages yet.", font=ctk.CTkFont(size=14))
            no_history_label.pack(pady=20)
            return

        for msg_idx, msg in enumerate(conversation_history):
            role = getattr(msg, "role", None) or msg.__class__.__name__
            content = getattr(msg, "content", str(msg))
            is_user = role.lower() in ["humanmessage", "user"]
            full_text = content

            # Styling
            fg_color = "#2C4056" if is_user else "#353936"
            text_color = "white"
            outer_anchor = "e" if is_user else "w"

            # Outer frame for alignment
            outer_frame = ctk.CTkFrame(self, fg_color="transparent")
            outer_frame.pack(
                fill="x",
                padx=10,
                pady=6,
                anchor=outer_anchor
            )

            # Avatar icon
            icon_label = ctk.CTkLabel(
                outer_frame,
                image=self.user_icon if is_user else self.bot_icon,
                text=""
            )

            # Determine bubble max width
            parent_width = self.winfo_width()
            if parent_width <= 1:
                parent_width = self.cget("width") if self.cget("width") > 1 else 600
            rel_width = 0.60 if is_user else 0.85
            bubble_max_width = int(parent_width * rel_width)
            bubble_max_width = max(bubble_max_width, 150)

            # Container for text + copy button
            message_container = ctk.CTkFrame(outer_frame, fg_color=fg_color, corner_radius=8)

            if is_user:
                # User message: CTkLabel with wrapping
                label = ctk.CTkLabel(
                    message_container,
                    text=full_text,
                    justify="left",
                    wraplength=bubble_max_width,
                    fg_color=fg_color,
                    text_color=text_color,
                    corner_radius=0,
                    font=ctk.CTkFont(size=14),
                    anchor="w"
                )
                label.pack(fill="x", expand=True, padx=5, pady=(5, 0))
            else:
                # AI message: CTkTextbox with dynamic height (fits all lines), no vertical scrollbar,
                # only horizontal scrollbar for long lines.
                textbox = ctk.CTkTextbox(
                    message_container,
                    width=bubble_max_width,
                    wrap="none",  # disable wrapping => horizontal scroll for long lines
                    fg_color=fg_color,
                    text_color=text_color,
                    font=ctk.CTkFont(size=14)
                )
                # Insert content and disable editing
                textbox.insert("0.0", full_text)
                textbox.configure(state="disabled")

                # Disable any internal yscrollcommand so it does not scroll vertically
                textbox.configure(yscrollcommand=lambda *args: None)

                # Compute required height so all lines are visible:
                last_index = textbox.index("end-1c")  # e.g. "N.chars"
                try:
                    num_lines = int(last_index.split('.')[0])
                except Exception:
                    num_lines = full_text.count("\n") + 1

                # Determine line height in pixels via tkinter.font
                try:
                    font_conf = textbox.cget("font")
                    tk_font = tkFont.Font(font=font_conf)
                    line_height = tk_font.metrics("linespace")
                except Exception:
                    line_height = 20  # fallback

                vertical_padding = 10  # e.g. 5px top + 5px bottom
                height_pixels = num_lines * line_height + vertical_padding
                textbox.configure(height=height_pixels)

                # Horizontal scrollbar only
                h_scroll = tk.Scrollbar(message_container, orient="horizontal", command=textbox.xview)
                textbox.configure(xscrollcommand=h_scroll.set)

                # Pack textbox and horizontal scrollbar
                textbox.pack(fill="x", padx=5, pady=(5, 0))
                h_scroll.pack(fill="x", padx=5, pady=(0, 5))

                # Bind mouse-wheel events on textbox to scroll outer frame instead of textbox
                # Windows typically uses "<MouseWheel>"; on some Linux setups you might also bind "<Button-4>" / "<Button-5>"
                textbox.bind("<MouseWheel>", self._on_textbox_mousewheel)
                # For Linux systems (optional, if needed):
                textbox.bind("<Button-4>", lambda e: self._parent_canvas.yview_scroll(-1, "units") or "break")
                textbox.bind("<Button-5>", lambda e: self._parent_canvas.yview_scroll(1, "units") or "break")

            # Copy button at bottom-left inside message_container
            copy_btn = ctk.CTkButton(
                message_container,
                text="Copy",
                width=60,
                height=24,
                fg_color="#444444",
                hover_color="#555555",
                font=ctk.CTkFont(size=12),
                command=lambda: None  # placeholder
            )
            # Bind correct command capturing button instance
            def make_cmd(text, button_widget):
                return lambda: self.copy_to_clipboard(text, button_widget)
            copy_btn.configure(command=make_cmd(full_text, copy_btn))
            copy_btn.pack(anchor="w", padx=5, pady=(0, 5))
            self._copy_buttons.append(copy_btn)

            # Pack icon and message_container
            if is_user:
                icon_label.pack(
                    side="right",
                    padx=(10, 6),
                    pady=(5, 0),
                    anchor="ne"
                )
                message_container.pack(
                    side="right",
                    padx=(6, 10),
                    pady=(5, 0),
                    anchor="ne"
                )
            else:
                icon_label.pack(
                    side="left",
                    padx=(6, 10),
                    pady=(5, 0),
                    anchor="nw"
                )
                message_container.pack(
                    side="left",
                    padx=(10, 6),
                    pady=(5, 0),
                    anchor="nw"
                )

        # Scroll to bottom after layout
        if conversation_history:
            self.after(100, lambda: self._parent_canvas.yview_moveto(1.0))
