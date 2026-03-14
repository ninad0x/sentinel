"use client"

import { MonitorProps } from "@/lib/types"
import { ArrowRight } from "lucide-react"

export default function IncidentTimeline({ data }: MonitorProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
        Incident Timeline
      </p>

      {!data.incidents.length ? (
        <p className="text-xs font-mono text-gray-400 px-8 py-6">No incidents recorded.</p>
      ) : (
        <div className="px-8 py-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1.75 top-2 bottom-2 w-px bg-gray-200" />

            <div className="flex flex-col gap-8">
              {data.incidents.map((incident) => {
                const isResolved = !!incident.endedAt
                const duration = incident.endedAt
                  ? Math.round(
                      (new Date(incident.endedAt).getTime() - new Date(incident.startedAt).getTime()) / 60000
                    )
                  : null

                return (
                  <div key={incident.id} className="relative flex gap-6">
                    {/* Dot */}
                    <div className={`relative z-10 mt-1 w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                      isResolved
                        ? "bg-white border-green-400"
                        : "bg-red-500 border-red-300 animate-pulse"
                    }`} />

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${isResolved ? "text-green-600" : "text-red-500"}`}>
                          {incident.status}
                        </span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {incident.type}
                        </span>
                      </div>

                      {incident.cause && (
                        <p className="text-sm text-gray-600 mb-2">
                          Affected: {incident.cause.split(", ").map(r => (
                            <span key={r} className="mx-px bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-600">{r}</span>
                          ))}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 underline">
                        <span>{new Date(incident.startedAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}</span>
                        <ArrowRight size={14}/>
                        {incident.endedAt && (
                          <span> {new Date(incident.endedAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}</span>
                        )}

                        {duration && (
                          <span className="text-gray-500">{duration} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}