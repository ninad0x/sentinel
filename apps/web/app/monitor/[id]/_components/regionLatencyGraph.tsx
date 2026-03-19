"use client"

import { MonitorProps } from "@/lib/types"
import React, { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "motion/react"

const COLORS = ["#111827", "#6b7280", "#d1d5db"]

export default function LatencyGraph({ data }: MonitorProps) {
  const [tab, setTab] = useState<"1h" | "24h">("1h")
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const regions = [...new Set(data.regionTicks.map(t => t.region?.name).filter(Boolean))] as string[]

  const toggle = (r: string) => setHidden(prev => {
    const next = new Set(prev)
    next.has(r) ? next.delete(r) : next.add(r)
    return next
  })

  // 1h — raw region ticks (last 10 per region)
  // 24h — hourly metrics, single avg latency line
  const is1h = tab === "1h"

  const metricsChartData = data.metrics
    .filter(m => m.avgResponseTimeMs !== null)
    .map(m => ({
      time: new Date(m.windowStart).getTime(),
      latency: m.avgResponseTimeMs
    }))

  if (!regions.length) return null

  return (
    <div className="border-b border-gray-200">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Regional Latency
      </p>
      <div className="flex items-center justify-between px-8 py-4">

        {/* Region toggles — only shown on 1h */}
        <div className="flex gap-2">
          {is1h && regions.map((r, i) => (
            <motion.button
              initial= {{ opacity: 0, filter: "blur(4px)"}}
              animate= {{ opacity: 1, filter: "blur(0px)"}}
              transition= {{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
              key={r}
              onClick={() => toggle(r)}
              className={`active:scale-95 text-xs px-3 py-1.5 rounded-lg transition-all ${
                hidden.has(r) 
                  ? "ring ring-gray-200 text-gray-400 bg-transparent" 
                  : "border-gray-200 bg-background text-gray-900 shadow-sm"
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: COLORS[i % COLORS.length] }} />
              {r}
            </motion.button>
          ))}
          {!is1h && <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Average Latency</p>}
        </div>

        {/* Tab toggle */}
        <Tabs value={tab} onValueChange={v => setTab(v as "1h" | "24h")}>
          <TabsList className="h-8">
            <TabsTrigger value="1h" className="text-xs px-3">1h</TabsTrigger>
            <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
          </TabsList>
        </Tabs>

      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
      <motion.div 
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="px-8 pb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={is1h ? undefined : metricsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={t => is1h
                ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
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

            {/* 1h: one line per region */}
            {is1h && regions.filter(r => !hidden.has(r)).map((r, i) => (
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
              />
            ))}

            {/* 24h: single avg latency line */}
            {!is1h && (
              <Line
                dataKey="latency"
                name="avg latency"
                type="monotone"
                dot={false}
                stroke="#111827"
                strokeWidth={1.5}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      </AnimatePresence>
    </div>
  )
}