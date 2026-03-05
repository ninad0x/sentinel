import React from 'react'
import { MonitorProps } from '@/lib/types'
import { motion } from 'motion/react'


export default function MonitorHeader({ data }: MonitorProps) {
return (
    <motion.nav
      className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200">
      
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-lg text-gray-900 tracking-tight">{data.website.name}</p>
        <p className="text-sm text-gray-400 font-mono">{data.website.url}</p>
      </div>

      <div className='flex flex-col items-end'>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${
            data.website.currentStatus < 400
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}>
            <span
              className={`w-1.5 h-1.5 rounded-full text-xl animate-pulse ${
                data.website.currentStatus < 400 ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {data.website.currentStatus < 400 ? "Operational" : "Down"}
        </span>
        <span className='text-sm text-gray-700 mt-0.5'>
          Last checked: {new Date(data.website.lastChecked!).toLocaleDateString()}
        </span>
      </div>


    </motion.nav>
  )
}
