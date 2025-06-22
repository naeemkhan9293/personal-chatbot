import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "About | Personal Assistant" }];

export const loader: LoaderFunction = async () => {
  // You can fetch data here if needed
  return json({
    appName: "Personal Assistant",
    description: "A smart assistant to help you with daily tasks.",
    version: "1.0.0",
    author: "Your Name"
  });
};

export default function About() {
  // This page is server-side rendered by Remix
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">About Personal Assistant</h1>
      <p className="mb-2">Personal Assistant is a smart assistant designed to help you with your daily tasks, automate workflows, and provide useful information.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Version: 1.0.0</li>
        <li>Author: Your Name</li>
      </ul>
      <p>For more information, visit our <a href="/" className="text-blue-600 underline">homepage</a>.</p>
    </div>
  );
}
