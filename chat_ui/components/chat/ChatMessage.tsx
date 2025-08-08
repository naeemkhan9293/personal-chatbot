import { FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: {
    content: string;
    type: "human" | "ai";
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isHuman = message.type === "human";

  return (
    <div className={`flex items-start gap-4 ${isHuman ? "justify-end" : ""}`}>
      {!isHuman && (
        <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
          <FaRobot className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div
        className={`${
          isHuman ? "bg-blue-600" : "bg-gray-700"
        } rounded-lg p-4 max-w-[75%]`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
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
      </div>
      {isHuman && (
        <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
          <FaUser className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}
