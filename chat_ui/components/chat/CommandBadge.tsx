import React from "react";

interface CommandBadgeProps {
  command: "generate image" | "scrap website";
}

const commandStyles = {
  "generate image": {
    label: "Image",
    bgColor: "bg-blue-500",
  },
  "scrap website": {
    label: "Scrap",
    bgColor: "bg-green-500",
  },
};

export default function CommandBadge({ command }: CommandBadgeProps) {
  const { label, bgColor } = commandStyles[command];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${bgColor}`}
    >
      {label}
    </span>
  );
}
