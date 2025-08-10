"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PencilRulerIcon,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { ChatHistory } from "./chat-history";

// This is sample data.
const data = {
  user: {
    name: "Assistant User",
    email: "user@assistant.com",
    avatar: "/robot.png",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Generate Image",
          url: "/dashboard/chat/new?com=generate_image",
        },
        {
          title: "Scrap WebSite",
          url: "/dashboard/chat/new?com=generate_image",
        },
      ],
    },
    {
      title: "Design",
      url: "#",
      icon: PencilRulerIcon,
      items: [
        {
          title: "Poster Design",
          url: "/dashboard/design/new?com=generate_poster_images",
        },
        {
          title: "Logo Design",
          url: "/dashboard/design/new?com=generate_logo_images",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <ChatHistory isCollapsed={state === "collapsed"} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
