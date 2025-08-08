import { FaRobot, FaUser } from "react-icons/fa";

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
        <p>{message.content}</p>
      </div>
      {isHuman && (
        <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center">
          <FaUser className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}
