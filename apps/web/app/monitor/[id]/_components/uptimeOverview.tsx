"use client"

import { MonitorProps } from "@/lib/types"

export default function UptimeOverview({ data }: MonitorProps) {
  const items = [
    { label: "24 Hours", value: data.uptime.h24 },
    { label: "7 Days", value: data.uptime.d7 },
    { label: "30 Days", value: data.uptime.d30 }
  ]

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Uptime
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
        {items.map(item => (
          <div key={item.label} className="px-8 py-8 flex flex-col gap-3">
            <span className="text-sm font-mono text-gray-500">{item.label}</span>
            <p className="text-3xl font-semibold text-gray-900 tracking-tight">
              {item.value.toFixed(2)}
              <span className="text-lg font-normal text-gray-400 ml-1">%</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}