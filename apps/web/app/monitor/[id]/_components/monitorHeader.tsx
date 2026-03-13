import React from 'react'
import { MonitorProps } from '@/lib/types'
import { motion } from 'motion/react'
import StatusBadge from '@/components/ui/statusBadge'


export default function MonitorHeader({ data }: MonitorProps) {
return (
    <motion.nav
      className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200">
      
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-lg text-gray-900 tracking-tight">{data.website.name}</p>
        <p className="text-sm text-gray-400 font-mono">{data.website.url}</p>
      </div>

      <div className='flex flex-col items-end'>
        <StatusBadge status={data.website.currentStatus} />
        <span className='text-sm font-mono text-gray-600 mt-1.5'>
          Last checked: {new Date(data.website.lastChecked!).toLocaleString()}
        </span>
      </div>


    </motion.nav>
  )
}
