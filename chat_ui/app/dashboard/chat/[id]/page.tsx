'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessageMutation, useGetChatHistoryQuery } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [messages, setMessages] = useState<Array<{content: string, type: string}>>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(id === "new" ? null : id);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { data: chatHistoryData, refetch } = useGetChatHistoryQuery(chatId!, { skip: !chatId });
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
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (chatHistoryData) {
      setMessages(chatHistoryData.messages);
    }
  }, [chatHistoryData]);

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
        router.push(`/dashboard/chat/${data.chat_id}`);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${message.type === "human" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
                    <FaRobot className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div
                  className={`${message.type === "human" ? "bg-blue-600" : "bg-gray-700"} rounded-lg p-4 max-w-[75%]`}>
                  <p>{message.content}</p>
                </div>
                {message.type === "human" && (
                  <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-gray-400" />
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
              <FaPaperPlane className="w-5 h-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
