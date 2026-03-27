"use client";

import { MonitorProps } from "@/lib/types";
import { motion } from "motion/react";

const getColor = (uptime: number | null) => {
  if (uptime == null) return "bg-neutral-200";
  if (uptime >= 90) return "bg-emerald-500";
  if (uptime >= 80) return "bg-amber-400";
  return "bg-red-400";
};

export default function UptimeBars({ data }: MonitorProps) {
  const dayMap = new Map<string, number[]>();

  for (const m of data.monthlyMetrics) {
    const day = new Date(m.windowStart).toLocaleDateString();
    if (!dayMap.has(day)) dayMap.set(day, []);
    dayMap.get(day)!.push(m.uptimePercent);
  }

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const key = date.toLocaleDateString();
    const values = dayMap.get(key);
    const uptime = values
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;
    return { date, uptime };
  });

  return (
    <div className="flex items-center gap-5 justify-around py-6 px-8 mx-auto">
      <div className="flex flex-col gap-3">
        {/* bars */}
        <div className="flex gap-0.5 items-end h-10">
          {days.map(({ date, uptime }, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* bar */}
              <div
                className={`cursor-pointer w-1.5 h-6 hover:h-8.5 transition-all rounded-sm ${getColor(uptime)}`}
              />

              {/* tooltip */}
              <motion.div
                variants={{
                  rest: { opacity: 0, y: 6, filter: "blur(6px)" },
                  hover: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 
                           whitespace-nowrap rounded-md px-2 py-1 text-xs 
                           bg-neutral-900 text-white shadow-md"
              >
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-neutral-400">
                    {date.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-medium text-white">
                    {uptime?.toFixed(1) ?? "--"}%
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* date labels */}
        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-400">
            {days[0]!.date.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-xs font-mono text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}
