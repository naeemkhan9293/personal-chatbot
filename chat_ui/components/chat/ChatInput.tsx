import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
      <form onSubmit={handleSendMessage} className="relative">
        <Textarea
          placeholder="Type your message..."
          className="pr-16 rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSendMessage(e);
            }
          }}
        />
        <Button
          type="submit"
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          <FaPaperPlane className="w-5 h-5" />
        </Button>
      </form>
    </footer>
  );
}
