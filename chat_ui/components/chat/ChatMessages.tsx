import { useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import ChatMessage from "./ChatMessage";

interface Message {
  content: string;
  type: "human" | "ai";
  status?: "processing" | "complete";
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
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-transparent">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="rounded-full glass-intense w-8 h-8 flex items-center justify-center glass-float">
              <FaRobot className="w-5 h-5 text-primary" />
            </div>
            <div className="glass-intense rounded-lg p-4 max-w-[75%] flex items-center gap-3 glass-shimmer">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <span className="text-muted-foreground text-sm">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
