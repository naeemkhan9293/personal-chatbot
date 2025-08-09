import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";
import CommandBadge from "./CommandBadge";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

type Command = "generate image" | "scrap website";

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeCommand, setActiveCommand] = useState<Command | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const commands: Command[] = ["generate image", "scrap website"];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    if (activeCommand) {
      return;
    }

    if (value === "/") {
      setShowMenu(true);
      setFocusedIndex(0);
    } else {
      setShowMenu(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !activeCommand) return;

    const message = activeCommand ? `/${activeCommand} ${input}` : input;
    onSendMessage(message);
    setInput("");
    setActiveCommand(null);
    setShowMenu(false);
  };

  const handleOptionClick = (option: Command) => {
    setActiveCommand(option);
    setInput("");
    setShowMenu(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input, activeCommand]);

  useEffect(() => {
    if (textareaRef.current && badgeRef.current) {
      const badgeWidth = badgeRef.current.offsetWidth;
      textareaRef.current.style.textIndent = `${badgeWidth + 8}px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.textIndent = "0px";
    }
  }, [activeCommand]);

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
      <div className="relative">
        {showMenu && (
          <div className="absolute bottom-full mb-2 w-full rounded-lg bg-gray-700 border border-gray-600 text-white shadow-lg z-10">
            <ul>
              {commands.map((command, index) => (
                <li
                  key={command}
                  className={`px-4 py-2 cursor-pointer ${
                    index === focusedIndex ? "bg-gray-600" : ""
                  }`}
                  onClick={() => handleOptionClick(command)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {command.charAt(0).toUpperCase() + command.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative">
          <div className="relative flex items-center">
            {activeCommand && (
              <div
                ref={badgeRef as any}
                className="absolute top-1.5 left-3"
              >
                <CommandBadge command={activeCommand} />
              </div>
            )}
            <Textarea
              ref={textareaRef}
              placeholder={
                activeCommand ? "" : "Type your message or / for commands"
              }
              className="pr-16 rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 w-full"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (showMenu) {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setFocusedIndex((prevIndex) =>
                      prevIndex > 0 ? prevIndex - 1 : commands.length - 1
                    );
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setFocusedIndex((prevIndex) =>
                      prevIndex < commands.length - 1 ? prevIndex + 1 : 0
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    handleOptionClick(commands[focusedIndex]);
                  }
                } else if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e);
                }

                if (e.key === "Backspace" && input === "" && activeCommand) {
                  setActiveCommand(null);
                }
              }}
              rows={1}
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <FaPaperPlane className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </footer>
  );
}
