"use client";

import { ChevronRight, History, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import * as React from "react";
import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useGetAllChatsQuery } from "@/store/api";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatLoading from "./chat/ChatLoading";

interface ChatHistoryProps {
  isCollapsed: boolean;
}

export function ChatHistory({ isCollapsed }: ChatHistoryProps) {
  const { data, isLoading } = useGetAllChatsQuery();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-4">
        <ChatLoading className="w-5 h-5" />
      </div>
    );

  const chats = data?.chats || [];

  return (
    <SidebarGroup>
      <Collapsible
        className="group/collapsible"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip="History"
            className="group/history-collapsible"
          >
            <History className="h-5 w-5" />
            {!isCollapsed && (
              <>
                <SidebarGroupLabel className="group-hover/history-collapsible:text-primary">
                  History
                </SidebarGroupLabel>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className={cn([
              "flex flex-col gap-2",
              isCollapsed ? "px-0" : "px-2",
            ])}
          >
            {chats.map((chat, index) =>
              isCollapsed ? (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/dashboard/chat/${chat.chat_id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-9 w-9 glass-button border-0 hover:bg-transparent"
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">{chat.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{chat.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link
                  key={index}
                  href={`/dashboard/chat/${chat.chat_id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start overflow-hidden glass-button border-0 hover:bg-transparent"
                  )}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {chat.title}
                </Link>
              )
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
