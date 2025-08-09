"use client";

import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const router = useRouter();
  const { state } = useSidebar();

  const handleNewChat = () => {
    router.push("/dashboard/chat/new");
  };

  return (
    <header
      className={cn([
        "glass-header py-2 px-4 flex items-center justify-between text-foreground fixed z-50 h-14 transition-all duration-200 ease-linear w-full backdrop-blur-md",
        state === "expanded"
          ? "md:w-[calc(100vw-248px)]"
          : "md:w-[calc(100vw-40px)]",
      ])}
    >
      <SidebarTrigger className="glass-button border-0" />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleNewChat}
          className="glass-button flex items-center gap-2 text-foreground border-0 hover:bg-transparent"
        >
          <IoMdAdd className="h-5 w-5" />
          New Chat
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
