"use client"

import { MonitorProps } from "@/lib/types"
import React, { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const COLORS = ["#111827", "#6b7280", "#d1d5db"]

export default function RegionalLatency({ data }: MonitorProps) {
  
  const regions = [...new Set(data.regionTicks.map(t => t.region?.name).filter(Boolean))] as string[]
  
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const toggle = (r: string) => setHidden(prev => {
    const next = new Set(prev)
    if (next.has(r)) {
      next.delete(r)
    } else {
      next.add(r)
    }
    return next
  })


  if (!regions.length) return null

  return (
    <div className="border-b border-gray-200">
      
      {/* Region toggles */}
      <div className="flex gap-2 px-8 py-6 items-center">
        {regions.map((r, i) => (
          <button
            key={r}
            onClick={() => toggle(r)}
            className={`cursor-pointer text-xs px-3 py-1 rounded-lg border transition-all ${
              hidden.has(r) ? "border-gray-300 text-gray-400" : "border-gray-800 bg-zinc-800 text-white"
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: COLORS[i % COLORS.length] }} />
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-8 pb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            />
            <YAxis
              unit="ms"
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
              labelFormatter={t => new Date(Number(t)).toLocaleTimeString()}
              formatter={(value, name) => [`${value} ms`, name]}
            />

            {regions.filter(r => !hidden.has(r)).map((r, i) => (
              <Line
                key={r}
                data={data.regionTicks
                  .filter(t => t.region?.name === r)
                  .slice(-10)
                  .map(t => ({ time: new Date(t.createdAt).getTime(), latency: t.responseTimeMs }))}
                dataKey="latency"
                name={r}
                type="monotone"
                dot={false}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                // isAnimationActive={false}
              />
            ))}
            
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}