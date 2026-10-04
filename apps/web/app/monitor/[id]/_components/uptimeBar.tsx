"use client";

import { MonitorProps } from "@/lib/types";
import { motion } from "motion/react";

// null = no checks that day
const getColor = (uptime: number | null) => {
  if (uptime === null) return "bg-neutral-200";
  if (uptime >= 99) return "bg-emerald-500";
  if (uptime >= 95) return "bg-amber-400";
  return "bg-red-400";
};

// "2026-10-04" -> "Oct 4" (built from the parts, so the viewer's timezone can't shift the day)
const label = (isoDay: string) =>
  new Date(`${isoDay}T00:00:00`).toLocaleDateString([], { month: "short", day: "numeric" });

export default function UptimeBars({ data }: MonitorProps) {
  const days = data.dailyUptime; // 30 ready-made days, computed in getMonitorData

  return (
    <div className="flex items-center gap-5 justify-around py-6 px-8 mx-auto">
      <div className="flex flex-col gap-3">
        {/* bars */}
        <div className="flex gap-0.5 items-end h-10">
          {days.map(({ date, uptime, p95 }) => (
            <motion.div
              key={date}
              className="relative group"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* bar */}
              <div
                className={`cursor-pointer w-1.5 h-6 hover:h-8.5 transition-all rounded-sm ${getColor(uptime)}`}
              />

              {/* tooltip: date, uptime, worst-hour P95 */}
              <motion.div
                variants={{
                  rest: { opacity: 0, y: 6, filter: "blur(6px)" },
                  hover: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 z-10
                           whitespace-nowrap rounded-md px-2 py-1 text-xs
                           bg-neutral-900 text-white shadow-md"
              >
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-neutral-400">{label(date)}</span>
                  <span className="text-xs font-medium text-white">
                    {uptime === null ? "No data" : `${uptime.toFixed(2)}%`}
                  </span>
                  {p95 !== null && (
                    <span className="text-[11px] text-neutral-400">P95 : {p95}ms</span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* date labels */}
        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-400">{label(days[0]!.date)}</span>
          <span className="text-xs font-mono text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}
