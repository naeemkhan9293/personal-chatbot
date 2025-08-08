'use client'

import { useState, useEffect } from "react";
import { useSendMessageMutation, useGetChatHistoryQuery } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatLoading from "@/components/chat/ChatLoading";

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [messages, setMessages] = useState<Array<{content: string, type: 'human' | 'ai'}>>([]);
  const [chatId, setChatId] = useState(id === "new" ? null : id);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const { data: chatHistoryData, refetch, isLoading: isHistoryLoading } = useGetChatHistoryQuery(chatId!, { skip: !chatId });

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
      setMessages(chatHistoryData.messages as Array<{content: string, type: 'human' | 'ai'}>);
    }
  }, [chatHistoryData]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { content: message, type: "human" as const }];
    setMessages(newMessages);

    if (chatId) {
      const { data } = await sendMessage({ message, chat_id: chatId });
      if (data) {
        setMessages(data.response as Array<{content: string, type: 'human' | 'ai'}>);
      }
    } else {
      const { data } = await sendMessage({ message });
      if (data) {
        router.push(`/dashboard/chat/${data.chat_id}`);
      }
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] bg-gray-900 text-white items-center justify-center">
        <ChatLoading />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-gray-900 text-white">
      <div className="flex flex-col flex-1">
        <ChatMessages messages={messages} isLoading={isSending} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
      </div>
    </div>
  );
}
