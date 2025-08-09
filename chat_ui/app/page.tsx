import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

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
        <div className="glass-intense p-8 text-center max-w-2xl glass-shimmer">
          <h1 className="text-5xl font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Personal Assistance
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Your AI-powered assistant for productivity, organization, and creativity.<br />
            <span className="text-primary font-medium">Minimal. Fast. Reliable.</span>
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <Link
              href="/dashboard/chat/new"
              className="glass-intense bg-primary/80 text-primary-foreground rounded-lg py-3 px-6 font-semibold transition-all duration-300 ease-in-out text-center transform hover:scale-105 border-0 glass-shimmer"
            >
              Try a Demo Chat
            </Link>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline text-center hover:text-primary transition-colors"
            >
              Learn more on GitHub
            </a>
          </div>
        </div>
        <footer className="mt-8 text-xs text-muted-foreground opacity-70">
          &copy; {new Date().getFullYear()} Personal Assistance. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
