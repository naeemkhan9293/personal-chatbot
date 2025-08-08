import { useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import ChatLoading from "./ChatLoading";

interface Message {
  content: string;
  type: "human" | "ai";
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
              <FaRobot className="w-5 h-5 text-gray-400" />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-[75%]">
              <ChatLoading />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
