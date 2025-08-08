import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Personal Assistance" },
    { name: "description", content: "Welcome to Personal Assistance!" },
  ];
};

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="absolute inset-0 bg-grid-gray-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/robot.png"
          alt="Personal Assistant Robot"
          className="w-32 h-32 mb-6 drop-shadow-[0_0_2rem_#60a5fa] animate-fade-in rounded-full border-4 border-blue-500 bg-gray-800"
          style={{ objectFit: 'cover' }}
        />
        <h1 className="text-5xl font-bold mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Personal Assistance
        </h1>
        <p className="text-lg text-gray-400 mb-6 text-center max-w-md">
          Your AI-powered assistant for productivity, organization, and creativity.<br />
          <span className="text-blue-500 font-medium">Minimal. Fast. Reliable.</span>
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            to="/chat/new"
            className="bg-blue-600 text-white rounded-lg py-3 px-4 font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out text-center transform hover:scale-105"
          >
            Try a Demo Chat
          </Link>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 underline text-center hover:text-blue-500 transition-colors"
          >
            Learn more on GitHub
          </a>
        </div>
        <footer className="mt-10 text-xs text-gray-600 opacity-70">
          &copy; {new Date().getFullYear()} Personal Assistance. All rights reserved.
        </footer>
      </div>
    </main>
  );
}