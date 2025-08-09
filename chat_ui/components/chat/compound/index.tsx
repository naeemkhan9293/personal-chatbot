"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useSendMessageMutation, useGetChatHistoryQuery } from "@/store/api";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatLoading from "@/components/chat/ChatLoading";
import ChatOptions from "@/components/chat/ChatOption";

interface ChatContextType {
  messages: Array<{ content: string; type: "human" | "ai" }>;
  isSending: boolean;
  isHistoryLoading: boolean;
  handleSendMessage: (message: string) => void;
  chatId: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [messages, setMessages] = useState<
    Array<{ content: string; type: "human" | "ai" }>
  >([]);
  const [chatId, setChatId] = useState<string | null>(id === "new" ? null : id);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const {
    data: chatHistoryData,
    refetch,
    isLoading: isHistoryLoading,
  } = useGetChatHistoryQuery(chatId!, { skip: !chatId });

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
      setMessages(
        chatHistoryData.messages as Array<{
          content: string;
          type: "human" | "ai";
        }>
      );
    }
  }, [chatHistoryData]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { content: message, type: "human" as const },
    ];
    setMessages(newMessages);

    if (chatId) {
      const { data } = await sendMessage({ message, chat_id: chatId });
      if (data && data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data.response as unknown as { content: string; type: "human" | "ai" },
        ]);
      }
    } else {
      const { data } = await sendMessage({ message });
      if (data) {
        router.push(`/dashboard/chat/${data.chat_id}`);
      }
    }
  };

  const value = {
    messages,
    isSending,
    isHistoryLoading,
    handleSendMessage,
    chatId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

function ChatRoot({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-foreground">
      <div className="flex flex-col flex-1 glass-card m-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function ChatMessagesComponent() {
  const { messages, isSending } = useChat();
  return <ChatMessages messages={messages} isLoading={isSending} />;
}

function ChatInputComponent() {
  const { handleSendMessage, isSending } = useChat();
  return <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />;
}

function ChatLoadingComponent() {
  const { isHistoryLoading } = useChat();
  if (!isHistoryLoading) return null;
  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-foreground items-center justify-center">
      <div className="glass-card p-8">
        <ChatLoading />
      </div>
    </div>
  );
}

function ChatOptionsComponent() {
  const { messages, chatId } = useChat();
  if (messages.length > 0 || chatId) return null;
  return <ChatOptions />;
}

// Assign the sub-components to the main Chat component
export const Chat = Object.assign(ChatRoot, {
  Provider: ChatProvider,
  Messages: ChatMessagesComponent,
  Input: ChatInputComponent,
  Loading: ChatLoadingComponent,
  Options: ChatOptionsComponent,
});
