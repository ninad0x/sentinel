'use client'

import WebsiteCard from './websiteCard'
import { CardData } from '@/lib/types'
import { AddWebsite } from './addWebsite'
import { useQuery } from '@tanstack/react-query'

export default function DashboardClient() {

  const { data } = useQuery({
    queryKey: ["website"],
    queryFn: () => fetch(`/api/dashboard`).then(res => res.json()),
    staleTime: 30_000
  })

  return (
    <div className="bg-gray-50/50 h-screen">
      <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border">
        <nav className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <p className="font-semibold text-lg text-gray-900 tracking-tight">Dashboard</p>
          <div className="flex items-center gap-6 text-sm font-mono text-gray-400">
            {/* <Link href="#" className="hover:text-gray-900 transition">Dashboard</Link>
            <Link href="#" className="hover:text-gray-900 transition">Settings</Link> */}
            <AddWebsite  />
          </div>
        </nav>
        <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200 flex justify-between items-center">
              Your Websites
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-b">
            {data?.map((site: CardData) => <WebsiteCard key={site.id} site={site} />)}
          </div>
        </div>
      </div>
    </div>
  )
}