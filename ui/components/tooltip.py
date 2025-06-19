import customtkinter as ctk

class Tooltip:
    """
    Creates a tooltip for a given widget.
    """
    def __init__(self, widget, text, delay=500, follow=True):
        self.widget = widget
        self.text = text
        self.delay = delay  # Milliseconds
        self.follow = follow # If True, tooltip follows mouse (currently not fully implemented for follow)
        self.tooltip_window = None
        self.id = None
        self.widget.bind("<Enter>", self.schedule_tooltip)
        self.widget.bind("<Leave>", self.hide_tooltip)
        self.widget.bind("<ButtonPress>", self.hide_tooltip) # Hide on click too

    def schedule_tooltip(self, event=None):
        self.unschedule_tooltip()
        self.id = self.widget.after(self.delay, self.show_tooltip)

    def unschedule_tooltip(self):
        if self.id:
            self.widget.after_cancel(self.id)
            self.id = None

    def show_tooltip(self, event=None):
        if self.tooltip_window: # Avoid creating multiple tooltips
            return
        x, y, _, _ = self.widget.bbox("insert") # Get widget's bounding box
        x += self.widget.winfo_rootx() + 25 # Offset from widget's top-left corner
        y += self.widget.winfo_rooty() + 20
        self.tooltip_window = ctk.CTkToplevel(self.widget)
        self.tooltip_window.wm_overrideredirect(True) # No window decorations (title bar, borders)
        self.tooltip_window.wm_geometry(f"+{x}+{y}") # Position the tooltip
        label = ctk.CTkLabel(self.tooltip_window, text=self.text, corner_radius=3, fg_color=("gray75", "gray25"), text_color=("black", "white"), padx=5, pady=3)
        label.pack(ipadx=1) # Pack label inside the Toplevel

    def hide_tooltip(self, event=None):
        self.unschedule_tooltip()
        if self.tooltip_window:
            self.tooltip_window.destroy()
            self.tooltip_window = None