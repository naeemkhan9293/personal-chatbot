import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Personal Assistance" },
    { name: "description", content: "Welcome to Personal Assistance!" },
  ];
};

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <img
        src="/robot.png"
        alt="Personal Assistant Robot"
        className="w-32 h-32 mb-6 drop-shadow-lg animate-fade-in rounded-full border-4 border-accent bg-card"
        style={{ objectFit: 'cover' }}
      />
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Personal Assistance</h1>
      <p className="text-lg text-muted-foreground mb-6 text-center max-w-md">
        Your AI-powered assistant for productivity, organization, and creativity.<br />
        <span className="text-accent font-medium">Minimal. Fast. Reliable.</span>
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <a
          href="/chat/demo"
          className="bg-primary text-primary-foreground rounded-lg py-2 px-4 font-semibold shadow hover:bg-primary/90 transition-colors text-center"
        >
          Try a Demo Chat
        </a>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground underline text-center hover:text-accent"
        >
          Learn more on GitHub
        </a>
      </div>
      <footer className="mt-10 text-xs text-muted-foreground opacity-70">
        &copy; {new Date().getFullYear()} Personal Assistance. All rights reserved.
      </footer>
    </main>
  );
}

