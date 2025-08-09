"use client";

import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";

export const NavHeader = () => {
  const { state } = useSidebar();

  return (
    <header
      className={`flex items-end gap-2 px-1 transition-all duration-500 ${
        state === "expanded" ? "p-2" : ""
      } glass-card rounded-lg`}
    >
      <div className="relative w-10 h-10 glass-card rounded-full p-1">
        <Image src="/robot.png" alt="logo" fill className="object-contain rounded-full" />
      </div>
      {state === "expanded" && (
        <h1 className="font-semibold text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          ASSISTANCE
        </h1>
      )}
    </header>
  );
};
