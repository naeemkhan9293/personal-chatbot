import { FaRobot, FaUser, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Download, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { downloadImage } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: {
    content: string;
    type: "human" | "ai";
    image_url?: string;
    status?: "processing" | "complete";
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isHuman = message.type === "human";
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`flex items-start gap-4 ${isHuman ? "justify-end" : ""}`}>
      {!isHuman && (
        <div className="rounded-full glass-intense w-8 h-8 flex items-center justify-center">
          <FaRobot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div
        className={`${
          isHuman
            ? "glass-intense bg-primary/20 border-primary/30"
            : "glass-intense"
        } rounded-lg p-4 max-w-[75%] relative group`}
      >
        {message.status && (
          <div className="absolute top-2 right-10 text-foreground">
            {message.status === "processing" && (
              <FaSpinner className="animate-spin h-5 w-5 text-primary" />
            )}
            {message.status === "complete" && (
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        )}
        <button
          onClick={() => handleCopy(message.content)}
          className="glass-button absolute top-2 right-2 text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 border-0"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="relative">
                  <button
                    onClick={() => handleCopy(String(children))}
                    className="glass-button absolute top-2 right-2 text-foreground p-2 rounded-full border-0"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
        {message.image_url && (
          <div className="mt-2 relative group">
            <img
              src={message.image_url}
              alt="Generated image"
              className="rounded-lg max-w-full h-auto"
            />
            <button
              onClick={() => downloadImage(message.image_url!)}
              className="glass-button absolute top-2 right-2 text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 border-0"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      {isHuman && (
        <div className="rounded-full glass-intense w-8 h-8 flex items-center justify-center">
          <FaUser className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  );
}
