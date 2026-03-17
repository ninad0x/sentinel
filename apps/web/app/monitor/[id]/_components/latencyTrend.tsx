"use client"

import { MonitorProps } from "@/lib/types"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function LatencyTrend({ data }: MonitorProps) {

  const chartData = data.metrics
    .filter(m => m.avgResponseTimeMs !== null)
    .map(m => ({
      time: new Date(m.windowStart).getTime(),
      latency: m.avgResponseTimeMs
    }))

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        24h Response Time
      </p>
      <div className="px-8 py-6 h-72 border-b border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(t) => new Date(t).toLocaleDateString([], { month: "short", day: "numeric" })}
            />
            <YAxis
              unit="ms"
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px" }}
              labelFormatter={(t) => new Date(t).toLocaleDateString()}
            />
            <Line dataKey="latency" type="monotone" dot={false} stroke="#111827" strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}