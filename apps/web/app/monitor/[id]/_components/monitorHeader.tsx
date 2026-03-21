import React from 'react'
import { MonitorProps } from '@/lib/types'
import { motion } from 'motion/react'
import StatusBadge from '@/components/ui/statusBadge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PopoverClose } from "@radix-ui/react-popover"
import { ArrowUpRight, ChevronLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function MonitorHeader({ data }: MonitorProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleDelete = async (id: string) => {
  await fetch(`/api/website/${id}`,
    { method: "DELETE" })
    router.push("/dashboard")
    queryClient.invalidateQueries({ queryKey: ["website"]})
  }

  return (
    <motion.nav
      className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-8 py-5 border-gray-200 mb-5">
      
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform duration-75">
          <ChevronLeft className="size-5" />
        </button>

        <div className='flex flex-col gap-1'>
          <p className="font-semibold text-lg text-gray-900 tracking-tight">{data.website.name}</p>
          <Link href={data.website.url} target='_' className="group flex items-center gap-1 w-fit text-sm text-gray-400 font-mono hover:text-gray-500 duration-75">
            {data.website.url}
          
          <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </div>

      <div className='flex flex-col items-end'>

        <div className="flex gap-2">
          <StatusBadge status={data.website.currentStatus} />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="border rounded-xl cursor-pointer text-gray-400 hover:text-red-400 hover:bg-transparent active:scale-95 shadow-xs transition-transform duration-75">
                <Trash2 className="size-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col items-center w-full font-mono text-gray-700">
              <p className="text-sm mb-2">Delete this monitor?</p>

              <div className="flex gap-2">

                <PopoverClose asChild>
                  <Button className='rounded-xl' variant="outline" size="sm">
                    Cancel
                  </Button>
                </PopoverClose>

                <Button className='rounded-xl hover:bg-red-700' variant="destructive" size="sm" onClick={() => handleDelete(data.website.id)}>
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>

        </div>
        <span className='text-sm font-mono text-gray-600 mt-1.5'>
          Last checked: {
            data.website.lastChecked === null 
            ? "--:--"
            : new Date(data.website.lastChecked!).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short"
              })
          }
        </span>
      </div>


    </motion.nav>
    )
}
