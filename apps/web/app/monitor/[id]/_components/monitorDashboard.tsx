'use client'
import { useQuery } from '@tanstack/react-query'
import MonitorHeader from "./monitorHeader"
import RegionCards from "./regionCards"
import RegionalLatency from './regionLatencyGraph'
import LatencyTrend from './latencyTrend'
import UptimeOverview from './uptimeOverview'
import IncidentTimeline from './incidentList'

export default function MonitorDashboard({ id }: { id: string }) {

  const { data, isLoading } = useQuery({
    queryKey: ['monitor', id],
    queryFn: () => fetch(`/api/monitor/${id}`).then(r => r.json()),
    staleTime: 30_000
  })

  if (isLoading) return (
        <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border animate-pulse">
            <div className="h-16 bg-gray-200 m-4 rounded" /> {/* header */}
            <div className="h-32 bg-gray-200 m-4 rounded" /> {/* region cards */}
            <div className="h-48 bg-gray-200 m-4 rounded" /> {/* graph */}
            <div className="h-48 bg-gray-200 m-4 rounded" /> {/* graph */}
        </div>
    )

  if (!data) return null

  return (
        <div className="bg-gray-50/50">
            <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border">
                <MonitorHeader data={data} />
                <RegionCards data={data} />
                <RegionalLatency data={data} />
                <LatencyTrend data={data} />
                <UptimeOverview data={data}/>
                <IncidentTimeline data={data}/>
            </div>
        </div>
    )
}