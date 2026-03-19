"use client"

import { MonitorProps } from "@/lib/types"

function getColor(uptime: number) {
  if (uptime >= 95) return "bg-zinc-500"
  if (uptime >= 75) return "bg-zinc-400"
  return "bg-red-400"
}

export default function UptimeOverview({ data }: MonitorProps) {
  const dayMap = new Map<string, number[]>()

  for (const m of data.monthlyMetrics) {
    const day = new Date(m.windowStart).toLocaleDateString()
    if (!dayMap.has(day)) dayMap.set(day, [])
    dayMap.get(day)!.push(m.uptimePercent)
  }

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const key = date.toLocaleDateString()
    const values = dayMap.get(key)
    const uptime = values ? values.reduce((a, b) => a + b, 0) / values.length : null
    return { date, uptime }
  })

  return (
    <div className="border-b border-gray-200 px-8 py-8">
      {/* <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Regional Latency
      </p> */}

      {/* Bar */}
      <div className="flex gap-0.5 mb-2">
        {days.map(({ date, uptime }, i) => (
          <div key={i} className="group relative">

            <div className={`h-8 w-2 ${uptime === null ? "bg-gray-200" : getColor(uptime)}`} />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap font-mono">
                <p>{date.toLocaleDateString([], { month: "short", day: "numeric" })}</p>
                <p>{uptime === null ? "No data" : `${uptime.toFixed(1)}%`}</p>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 -mt-1" />
            </div>
            
          </div>
        ))}
      </div>

      {/* Date labels */}
      <div className="flex justify-between mb-5">
        <span className="text-xs font-mono text-gray-500">
          {days[0]!.date.toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
        <span className="text-xs font-mono text-gray-500">Today</span>
      </div>

      {/* Stats */}
      {/* <div className="flex gap-8 ">
        {[
          { label: "24 Hours", value: data.uptime.h24 },
          { label: "7 Days",   value: data.uptime.d7  },
          { label: "30 Days",  value: data.uptime.d30 },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className={`text-xl font-semibold tracking-tight text-gray-900`}>
              {value.toFixed(2)}<span className="text-sm font-normal text-gray-400 ml-0.5">%</span>
            </p>
          </div>
        ))}
      </div> */}

    </div>
  )
}