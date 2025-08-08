'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessageMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [messages, setMessages] = useState<Array<{content: string, type: string}>>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(id === "new" ? null : id);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (id === "new") {
      setChatId(null);
      setMessages([]);
    } else {
      setChatId(id);
      // TODO: Fetch existing messages for this chat id
    }
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { content: input, type: "human" }];
    setMessages(newMessages);
    setInput("");

    if (chatId) {
      const { data } = await sendMessage({ message: input, chat_id: chatId });
      if (data) {
        setMessages(data.response);
      }
    } else {
      const { data } = await sendMessage({ message: input });
      if (data) {
        router.push(`/chat/${data.chat_id}`);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 py-4 px-6 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-bold">Personal Assistant</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${message.type === "human" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div
                  className={`${message.type === "human" ? "bg-blue-600" : "bg-gray-700"} rounded-lg p-4 max-w-[75%]`}>
                  <p>{message.content}</p>
                </div>
                {message.type === "human" && (
                  <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>
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
            <Button type="submit" className="absolute top-1/2 right-4 -translate-y-1/2 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              <SendIcon className="w-5 h-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
