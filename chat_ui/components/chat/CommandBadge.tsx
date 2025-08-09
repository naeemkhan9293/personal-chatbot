import React from "react";

interface CommandBadgeProps {
  command: "generate image" | "scrape website";
}

const commandStyles = {
  "generate image": {
    label: "Image",
    bgColor: "bg-blue-500/80",
  },
  "scrape website": {
    label: "Scrape",
    bgColor: "bg-green-500/80",
  },
};

export default function CommandBadge({ command }: CommandBadgeProps) {
  const { label, bgColor } = commandStyles[command];

  return (
    <span
      className={`glass-card inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-white border-0 ${bgColor}`}
    >
      {label}
    </span>
  );
}
