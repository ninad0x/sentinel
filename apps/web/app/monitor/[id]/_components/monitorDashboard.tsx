'use client'
import { useQuery } from '@tanstack/react-query'
import MonitorHeader from "./monitorHeader"
import RegionCards from "./regionCards"
import RegionalLatency from './regionLatencyGraph'
import LatencyTrend from './latencyTrend'
import UptimeOverview from './uptimeOverview'
import IncidentTimeline from './incidentList'
import { motion } from 'motion/react'

export default function MonitorDashboard({ id }: { id: string }) {

  const { data, isLoading } = useQuery({
    queryKey: ['monitor', id],
    queryFn: () => fetch(`/api/monitor/${id}`).then(r => r.json()),
    staleTime: 30_000
  })

  if (isLoading) return (
    <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border animate-pulse">
        <div className="h-16 bg-gray-200 m-4 rounded" />
        <div className="h-32 bg-gray-200 m-4 rounded" />
        <div className="h-48 bg-gray-200 m-4 rounded" />
        <div className="h-48 bg-gray-200 m-4 rounded" />
    </div>
)

  if (!data) return null

  return (
    <div className="bg-gray-50/50">
        <motion.div
            key={data}  // trigger when data loads
            className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border"
            initial="hidden"
            animate="visible"
            >
            {[MonitorHeader, RegionCards, RegionalLatency, LatencyTrend , UptimeOverview, IncidentTimeline]
                .map((Component, i) => (
                <motion.div
                    key={i}
                    variants={{
                        hidden: { 
                            opacity: 0,
                            y: 20,
                            filter: "blur(8px)"
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            // transition: { delay: i * 0.10 },
                            transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 },
                            filter: "blur(0px)"
                        }
                    }}
                >
                    <Component data={data} />
                </motion.div>
            ))}
            </motion.div>
    </div>
    )
}