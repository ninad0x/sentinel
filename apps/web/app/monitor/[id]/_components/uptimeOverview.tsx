"use client"

import SectionHeader from "@/components/sectionHeader"
import { MonitorProps } from "@/lib/types"

export default function UptimeOverview({ data }: MonitorProps) {
  const periods = [
    { label: "24 Hours", uptime: data.uptime.h24, latency: data.latency.h24 },
    { label: "7 Days", uptime: data.uptime.d7, latency: data.latency.d7 },
    { label: "30 Days", uptime: data.uptime.d30, latency: data.latency.d30 },
  ]

  return (
    <div>
      <SectionHeader text="Uptime" />

      <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
        {periods.map(({ label, uptime, latency }) => (
          <div key={label} className="px-8 py-8 flex flex-col gap-3">
            <span className="text-sm font-mono text-gray-500">{label}</span>

            <p className="text-4xl font-semibold tracking-tight">
              {/* null (or 0 with no checks yet) means no data, not a total outage */}
              {uptime === null ? "—" : uptime.toFixed(2)}
              {uptime !== null && (
                <span className="text-lg font-normal text-gray-400 ml-1">%</span>
              )}
            </p>

            <p className="text-xs font-mono text-gray-400">
              avg {latency > 0 ? `${latency} ms` : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
