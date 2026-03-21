import { cn } from '@/lib/utils'
import React from 'react'

export default function SectionHeader({ text, className}: {
    text: string,
    className?: string
}) {
  return (
    <p className={cn("text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-y border-gray-200", className)}
      style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 4px, #f5f5f8 4px, #f5f5f8 5px)" }}>
      {text}
    </p>
  )
}