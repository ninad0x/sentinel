import { prisma } from "@repo/db/client"
import { MonitorData } from "./types"
import { demoData } from "./demo";

const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

export const getMonitorData = async (websiteId: string): Promise<MonitorData | null> => {
  console.log("monitor data called");

  if (websiteId === "demo") return demoData as unknown as MonitorData

  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { id: true, name: true, url: true, currentStatus: true, lastChecked: true }
  })

  if (!website) return null

  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60 * 1000)
  const oneDayAgo = new Date(Date.now() - 2400 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [metrics, monthlyMetrics, incidents, regionTicks] = await Promise.all([

    // 24h hourly metrics graph
    prisma.websiteMetric.findMany({
      where: { websiteId, windowStart: { gte: oneDayAgo } },
      select: { windowStart: true, uptimePercent: true, avgResponseTimeMs: true, regionsDownList: true, regionsDownCount: true },
      orderBy: { windowStart: "asc" },
    }),

    // 30d hourly metrics for green bar + uptime/latency numbers
    prisma.websiteMetric.findMany({
      where: { websiteId, windowStart: { gte: thirtyDaysAgo } },
      select: { windowStart: true, uptimePercent: true, avgResponseTimeMs: true },
      orderBy: { windowStart: "asc" },
    }),

    prisma.incident.findMany({
      where: { websiteId },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),

    // last 1 hour raw ticks for live regional graph
    prisma.websiteTick.findMany({
      where: { websiteId, createdAt: { gte: oneHourAgo } },
      select: { createdAt: true, responseTimeMs: true, region: { select: { name: true } }, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  // Derive region summary from ticks
  const regionMap = new Map<string, { totalMs: number; totalChecks: number }>()

  for (const tick of regionTicks) {
    if (tick.status === 0 || tick.status >= 400) continue
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
    monthlyMetrics,
    incidents,
    regionTicks,
    regionSummary,

    uptime: {
      h24: avg(monthlyMetrics.filter(m => new Date(m.windowStart) >= oneDayAgo).map(m => m.uptimePercent)),
      d7: avg(monthlyMetrics.filter(m => new Date(m.windowStart) >= sevenDaysAgo).map(m => m.uptimePercent)),
      d30: avg(monthlyMetrics.map(m => m.uptimePercent)),
    },

    latency: {
      h24: avg(monthlyMetrics.filter(m => new Date(m.windowStart) >= oneDayAgo).map(m => m.avgResponseTimeMs ?? 0)),
      d7: avg(monthlyMetrics.filter(m => new Date(m.windowStart) >= sevenDaysAgo).map(m => m.avgResponseTimeMs ?? 0)),
      d30: avg(monthlyMetrics.map(m => m.avgResponseTimeMs ?? 0)),
    },
  }
}