import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value === "/") {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    setShowMenu(false);
  };

  const handleOptionClick = (option: string) => {
    setInput(`/${option} `);
    setShowMenu(false);
    textareaRef.current?.focus();
  };

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
      <div className="relative">
        {showMenu && (
          <div className="absolute bottom-full mb-2 w-full rounded-lg bg-gray-700 border border-gray-600 text-white shadow-lg">
            <ul>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                onClick={() => handleOptionClick("generate image")}
              >
                /generate image
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                onClick={() => handleOptionClick("scrap website")}
              >
                /scrap website
              </li>
            </ul>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message or / for commands"
            className="pr-16 rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            value={input}
            onChange={handleInputChange}
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
      </div>
    </footer>
  );
}
