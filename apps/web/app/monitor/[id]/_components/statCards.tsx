'use client'
import { MonitorProps } from '@/lib/types'
import { motion } from 'motion/react'

export default function StatCards({ data }: MonitorProps) {
  const totalChecks = data.regionSummary.reduce((acc, r) => acc + r.totalChecks, 0)
  const avgLatency = Math.round(
    data.regionSummary.reduce((acc, r) => acc + r.avgLatency, 0) / data.regionSummary.length
  )

  const stats = [
    { label: 'Uptime 24h', value: data.uptime.h24.toFixed(2), unit: '%', sub: '↑ all regions', green: true },
    { label: 'Avg Latency', value: avgLatency, unit: 'ms', sub: 'global avg' },
    { label: 'Total Checks', value: totalChecks, unit: '', sub: `last 24h · ${data.regionSummary.length} regions` },
    { label: 'Incidents', value: data.incidents.length, unit: '', sub: 'last 30 days' },
  ]

  return (
    <div className="grid grid-cols-4 border-b border-gray-200">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="px-8 py-6 border-r border-gray-200 last:border-r-0"
        >
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
          <p className={`text-3xl font-semibold tracking-tight ${s.green ? 'text-emerald-600' : 'text-gray-900'}`}>
            {s.value}
            <span className="text-sm font-normal text-gray-400 ml-0.5">{s.unit}</span>
          </p>
          <p className="text-xs font-mono text-gray-400 mt-1.5">{s.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}