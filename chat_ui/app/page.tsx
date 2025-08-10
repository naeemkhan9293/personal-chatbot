import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Personal Assistance",
  description: "Welcome to Personal Assistance!",
};

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-foreground px-4 relative">
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="glass-intense p-8 mb-8 rounded-full glass-float glass-shimmer">
          <img
            src="/robot.png"
            alt="Personal Assistant Robot"
            className="w-32 h-32 drop-shadow-[0_0_2rem_rgba(99,102,241,0.5)] animate-fade-in rounded-full"
            style={{ objectFit: 'cover' }}
          />
        </div>
       
       <Button className="glass-button">
          <Link href="/dashboard/chat/new">Start Chatting</Link>
       </Button>
        <footer className="mt-8 text-xs text-muted-foreground opacity-70">
          &copy; {new Date().getFullYear()} Personal Assistance. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
