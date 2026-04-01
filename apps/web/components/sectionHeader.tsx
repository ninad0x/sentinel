import { cn } from "@/lib/utils";
import React from "react";

export default function SectionHeader({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-y border-gray-200",
        "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#f5f5f8_4px,#f5f5f8_5px)]",
        className,
      )}
    >
      {text}
    </p>
  );
}
