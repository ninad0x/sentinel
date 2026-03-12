import React from 'react'
import { MonitorProps } from '@/lib/types'
import StatusBadge from '@/components/ui/statusBadge'


export default function RegionCards({ data }: MonitorProps) {
return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Regional Latency
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
        {data.regionSummary.map((region) => (
          <div key={region.name} className="px-8 py-6 flex flex-col gap-3">

            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-gray-500">{region.name}</span>
                <StatusBadge status={data.website.currentStatus} />
              
            </div>

            <p className="text-3xl font-semibold text-gray-900 tracking-tight">
              {region.avgLatency}
              <span className="text-base font-normal text-gray-400 ml-1">ms</span>
            </p>

            <p className="text-xs text-gray-400">{region.totalChecks} checks</p>

          </div>
        ))}
      </div>
    </div>
  )
}