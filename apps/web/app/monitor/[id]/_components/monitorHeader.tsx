import React from 'react'
import { MonitorProps } from '@/lib/types'
import { motion } from 'motion/react'
import StatusBadge from '@/components/ui/statusBadge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PopoverClose } from "@radix-ui/react-popover"
import { Delete, Trash, Trash2 } from 'lucide-react'

export default function MonitorHeader({ data }: MonitorProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleDelete = async (id: string) => {
  await fetch(`/api/website/${id}`,
    { method: "DELETE" })
    queryClient.invalidateQueries({ queryKey: ["website"]})
    router.push("/dashboard")
  }

  return (
    <motion.nav
      className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200">
      
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-lg text-gray-900 tracking-tight">{data.website.name}</p>
        <p className="text-sm text-gray-400 font-mono">{data.website.url}</p>
      </div>

      <div className='flex flex-col items-end'>

        <div className="flex gap-2">
          <StatusBadge status={data.website.currentStatus} />

          <Popover>
            <PopoverTrigger asChild>
              {/* <Button className='rounded-2xl border-red-200 bg-red-100 text-red-500 hover:bg-red-100 cursor-pointer hover:text-red-500' variant="outline">Delete</Button> */}
              <Button variant="ghost" size="icon" className="border rounded-xl cursor-pointer text-gray-400 hover:text-red-400 hover:bg-transparent">
                <Trash2 className="w-4 h-4" />
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
