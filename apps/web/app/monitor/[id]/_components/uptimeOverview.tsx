"use client"

import SectionHeader from "@/components/sectionHeader"
import { MonitorProps } from "@/lib/types"

export default function UptimeOverview({ data }: MonitorProps) {
  return <div>
    <SectionHeader text="30 day uptime" />
      
    <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
      {[
        { label: "24 Hours", value: data.uptime.h24 },
        { label: "7 Days",   value: data.uptime.d7  },
        { label: "30 Days",  value: data.uptime.d30 },
      ].map(({ label, value }) => (
        <div key={label} className="px-8 py-8 flex flex-col gap-3">
          <span className="text-sm font-mono text-gray-500">{label}</span>
          <p className={`text-4xl font-semibold tracking-tight `}>
            {value.toFixed(2)}
            <span className="text-lg font-normal text-gray-400 ml-1">%</span>
          </p>
        </div>
      ))}
      </div>
    </div>
}