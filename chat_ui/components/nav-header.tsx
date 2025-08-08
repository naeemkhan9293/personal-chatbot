"use client";

import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";

export const NavHeader = () => {
  const { state } = useSidebar();

  return (
    <header
      className={`flex items-end gap-2 px-1 transition-all duration-500 ${
        state === "expanded" ? "p-2" : ""
      } bg-gray-900 rounded`}
    >
      <div className="relative w-10 h-10 ">
        <Image src="/robot.png" alt="logo" fill className="object-contain" />
      </div>
      {state === "expanded" && (
        <h1 className="font-semibold text-xl">Person Assistance</h1>
      )}
    </header>
  );
};
