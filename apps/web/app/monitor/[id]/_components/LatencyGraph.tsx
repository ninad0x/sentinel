"use client"

import { MonitorProps } from "@/lib/types"
import React, { useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "motion/react"

const COLORS = ["#111827", "#6b7280", "#ADADAD"]

type Metric = "avg" | "p50" | "p95" | "p99"

const METRIC_FIELD = {
  avg: "avgResponseTimeMs",
  p50: "p50Ms",
  p95: "p95Ms",
  p99: "p99Ms",
} as const

type Point = { [key: string]: number | null; time: number }

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

// No timeZone option: the browser uses each viewer's own timezone.
const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
}

const formatTime = (time: number) =>
  new Date(time).toLocaleTimeString("en-IN", TIME_OPTS)

// 24h points are hourly buckets, so the tooltip shows the range: "4 Oct, 03:30 pm – 04:30 pm"
const formatTooltipTime = (time: number, isRange: boolean) => {
  const start = new Date(time)
  const date = start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  const from = start.toLocaleTimeString("en-IN", TIME_OPTS)
  if (!isRange) return `${date}, ${from}`
  const to = new Date(time + HOUR).toLocaleTimeString("en-IN", TIME_OPTS)
  return `${date}, ${from} – ${to}`
}

export default function LatencyGraph({ data }: MonitorProps) {
  const [tab, setTab] = useState<"1h" | "24h">("1h")
  const [metric, setMetric] = useState<Metric>("avg")
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const regions = data.regions.map((r) => r.name).sort()
  const is1h = tab === "1h"

  // fixed per data load, so ticks and domain don't change on every render
  const now = useMemo(() => Date.now(), [data])
  const chartStart = now - (is1h ? HOUR : DAY)
  const chartEnd = now

  const ticks = useMemo(() => {
    const step = is1h ? 10 * 60 * 1000 : 4 * HOUR
    const result: number[] = []

    for (let time = Math.ceil(chartStart / step) * step; time < chartEnd; time += step) {
      result.push(time)
    }

    result.push(chartEnd)
    return result
  }, [is1h, chartStart, chartEnd])

  const toggle = (region: string) =>
    setHidden((prev) => {
      const next = new Set(prev)
      next.has(region) ? next.delete(region) : next.add(region)
      return next
    })

  // One row per timestamp with a column per region, so the lines share the x-axis.
  const chartData = useMemo<Point[]>(() => {
    const rows = new Map<number, Point>()

    const put = (time: number, region: string, value: number | null) => {
      const row = rows.get(time) ?? { time }
      row[region] = value
      rows.set(time, row)
    }

    if (is1h) {
      // roundAt is identical across regions, so the 3 regions land on the same row
      for (const t of data.regionTicks) {
        put(new Date(t.roundAt).getTime(), t.region.name, t.responseTimeMs)
      }
    } else {
      const nameById = new Map(data.regions.map((r) => [r.id, r.name]))
      const field = METRIC_FIELD[metric]

      for (const m of data.metrics) {
        const name = nameById.get(m.regionId) // "ALL" has no name, so it's skipped
        if (name) put(new Date(m.windowStart).getTime(), name, m[field])
      }
    }

    return [...rows.values()].sort((a, b) => a.time - b.time)
  }, [data, is1h, metric])

  if (!regions.length) return null

  return (
    <div className="border-gray-200 mb-5">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex gap-2">
          {regions.map((region, i) => (
            <motion.button
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
              key={region}
              onClick={() => toggle(region)}
              className={`cursor-pointer active:scale-97 text-xs px-3 py-1 rounded-lg border transition-all ${
                hidden.has(region)
                  ? "border-dashed border-gray-200 text-gray-400"
                  : "border-gray-300 bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {region}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!is1h && (
            <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
              <TabsList className="h-8">
                <TabsTrigger value="p50" className="text-xs px-3">P50</TabsTrigger>
                <TabsTrigger value="p95" className="text-xs px-3">P95</TabsTrigger>
                <TabsTrigger value="p99" className="text-xs px-3">P99</TabsTrigger>
                <TabsTrigger value="avg" className="text-xs px-3">Avg</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <Tabs value={tab} onValueChange={(v) => setTab(v as "1h" | "24h")}>
            <TabsList className="h-8">
              <TabsTrigger value="1h" className="text-xs px-3">1h</TabsTrigger>
              <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="px-8 pb-6 h-64"
        >
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              {is1h
                ? "No checks in the last hour."
                : "No hourly data yet. It appears after the first compile."}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

                <XAxis
                  dataKey="time"
                  type="number"
                  domain={[chartStart, chartEnd]}
                  ticks={ticks}
                  tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatTime}
                />

                <YAxis
                  unit="ms"
                  tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "monospace" }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(t) => formatTooltipTime(Number(t), !is1h)}
                  formatter={(value, name) => [`${value} ms`, name]}
                />

                {regions
                  .filter((region) => !hidden.has(region))
                  .map((region) => (
                    <Line
                      key={region}
                      dataKey={region}
                      name={region}
                      type="monotone"
                      dot={false}
                      connectNulls={false}
                      stroke={COLORS[regions.indexOf(region) % COLORS.length]}
                      strokeWidth={1.5}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
