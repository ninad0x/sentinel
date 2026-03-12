import { prisma } from "@repo/db/client"
import { MonitorData } from "./types"

const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

export const getMonitorData = async (websiteId: string): Promise<MonitorData | null> => {
  console.log("monitor data called");
  
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      select: { id: true, name: true, url: true, currentStatus: true, lastChecked: true }
    })

    if (!website) return null

    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [metrics, incidents, regionTicks] = await Promise.all([

      prisma.websiteMetric.findMany({
        where: { websiteId, windowStart: { gte: thirtyDaysAgo } },
        select: { windowStart: true, uptimePercent: true, avgResponseTimeMs: true, regionsDownCount: true, regionsDownList: true },
        orderBy: { windowStart: "asc" }
      }),

      prisma.incident.findMany({
        where: { websiteId },
        orderBy: { startedAt: "desc" },
        take: 5
      }),

      prisma.websiteTick.findMany({
        where: { websiteId, createdAt: { gte: oneDayAgo } },
        select: { createdAt: true, responseTimeMs: true, region: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
        take: 30
      }),
    ])

    // Derive region summary from ticks
    const regionMap = new Map<string, { totalMs: number; totalChecks: number }>()

    for (const tick of regionTicks) {
      const name = tick.region.name
      const existing = regionMap.get(name) ?? { totalMs: 0, totalChecks: 0 }
      regionMap.set(name, {
        totalMs: existing.totalMs + tick.responseTimeMs,
        totalChecks: existing.totalChecks + 1
      })
    }

    const regionSummary = Array.from(regionMap.entries()).map(([name, r]) => ({
      name,
      avgLatency: Math.round(r.totalMs / r.totalChecks),
      totalChecks: r.totalChecks
    }))

    return {
      website,
      metrics,
      incidents,
      regionTicks,
      regionSummary,
      
      uptime: {
        h24: avg(metrics.filter(m => m.windowStart >= oneDayAgo).map(m => m.uptimePercent)),
        d7: avg(metrics.filter(m => m.windowStart >= sevenDaysAgo).map(m => m.uptimePercent)),
        d30: avg(metrics.map(m => m.uptimePercent))
      },
      
      latency: {
        h24: avg(metrics.filter(m => m.windowStart >= oneDayAgo).map(m => m.avgResponseTimeMs ?? 0)),
        d7: avg(metrics.filter(m => m.windowStart >= sevenDaysAgo).map(m => m.avgResponseTimeMs ?? 0)),
        d30: avg(metrics.map(m => m.avgResponseTimeMs ?? 0)),
      }
    }
  }