"use client";

import { Chat } from "@/components/chat/compound";

export default function ChatPage() {
  return (
    <Chat.Provider>
      <Chat>
        <Chat.Loading />
        <Chat.Options />
        <Chat.Messages />
        <Chat.Input />
      </Chat>
    </Chat.Provider>
  );
}
