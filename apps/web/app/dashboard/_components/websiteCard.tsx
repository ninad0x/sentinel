import { CardData } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'


export default function WebsiteCard({ site }: {site: CardData}) {

    const queryClient = useQueryClient()
    const prefetch = () => {
        queryClient.prefetchQuery({
            queryKey: ['monitor', site.id],
            queryFn: () => fetch(`/api/monitor/${site.id}`).then(r => r.json()),
            staleTime: 30_000
        })
    }

    return (
        <div
        // className='relative group'    // uncomment for corner bracket animation
        >
        <Link
            key={site.id} 
            href={`/monitor/${site.id}`}
            onMouseEnter={prefetch}
            className="px-8 py-6 hover:bg-gray-50 transition flex flex-col gap-4"
            >
            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 tracking-tight">{site.name}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${
                site.currentStatus < 400 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "bg-red-50 text-red-600"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                    site.currentStatus < 400 ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`} />
                {site.currentStatus < 400 ? 'Up' : 'Down'}
                </span>
            </div>
            
            <p className="text-sm font-mono text-gray-400">{site.url}</p>
            
            <div className="flex gap-6 text-sm">
                <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">24h Uptime</span>
                <span className="font-semibold text-gray-900">{site.uptime24h.toFixed(2)}%</span>
                </div>
                {site.avgResponseTime && (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Avg Latency</span>
                    <span className="font-semibold text-gray-900">{site.avgResponseTime}ms</span>
                </div>
                )}
            </div>
        </Link>

        {/* Corner bracket animation */}
        {/* <div className="absolute duration-00 top-0 left-0 h-3 w-3 border-t border-l border-gray-500 group-hover:top-1 group-hover:left-1 " />

        <div className="absolute duration-200 top-0 right-0 h-3 w-3 border-t border-r border-gray-500 group-hover:top-1 group-hover:right-1 " />

        <div className="absolute duration-200 bottom-0 left-0 h-3 w-3 border-b border-l border-gray-500 group-hover:bottom-1 group-hover:left-1 " />

        <div className="absolute duration-200 bottom-0 right-0 h-3 w-3 border-b border-r border-gray-500 group-hover:bottom-1 group-hover:right-1 " /> */}
       


        </div>
  )
}
