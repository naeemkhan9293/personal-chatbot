"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import * as React from "react";
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-4">
        <ChatLoading className="w-5 h-5" />
      </div>
    );

  const chats = data?.chats || [];

  return (
    <SidebarGroup>
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="History" className="group/history-collapsible">
            <SidebarGroupLabel className="group-hover/history-collapsible:text-black">History</SidebarGroupLabel>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 px-2">
            {chats.map((chat, index) =>
              isCollapsed ? (
                <TooltipProvider key={index}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/dashboard/chat/${chat.chat_id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-9 w-9"
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">{chat.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {chat.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link
                  key={index}
                  href={`/dashboard/chat/${chat.chat_id}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start"
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
