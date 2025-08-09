"use client";

import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { state } = useSidebar();

  const handleNewChat = () => {
    router.push("/dashboard/chat/new");
  };

  return (
    <header className="bg-gray-800 py-2 px-4 flex items-center justify-between border-b border-gray-700 text-white fixed  z-50 h-14 transition-all duration-200 ease-linear w-full md:w-[calc(100vw-250px)]">
      <SidebarTrigger />
      <Button
        variant="outline"
        onClick={handleNewChat}
        className="flex items-center gap-2 text-black"
      >
        <IoMdAdd className="h-5 w-5" />
        New Chat
      </Button>
    </header>
  );
}
