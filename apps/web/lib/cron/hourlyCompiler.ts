import { prisma } from "@repo/db/client";

export async function compileHourlyMetrics() {
  const now = new Date()
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0)
  const lastHourStart = new Date(hourStart.getTime() - 60 * 60 * 1000)

  // TEST
  const minute = now.getMinutes()
  const bucket = Math.floor(minute / 5) * 5
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), bucket, 0, 0)
  const lastWindowStart = new Date(windowStart.getTime() - 5 * 60 * 1000)

  // if already compiled for this hour
  const existing = await prisma.websiteMetric.findFirst({
    where: { windowStart: lastWindowStart }
  })
  
  if (existing) {
    console.log(`Metrics for ${lastWindowStart.toISOString()} already compiled`)
    return { compiled: 0, window: lastWindowStart.toISOString(), skipped: true }
  }

  // group by
  const groups = await prisma.websiteTick.groupBy({
    by: ["websiteId", "regionId", "status"],
    where: { createdAt: { gte: lastWindowStart, lt: windowStart } },
    _count: { _all: true },
    _avg: { responseTimeMs: true }
  })

  if (groups.length === 0) {
    console.log(`No ticks found for ${lastWindowStart.toISOString()}`)
    return { compiled: 0, window: lastWindowStart.toISOString(), noData: true }
  }

  const metricsMap = new Map<string, {
    total: number
    up: number
    latSum: number
    latCount: number
    downRegions: Set<string>
  }>()

  // combine group to one entry
  for (const g of groups) {
    if (!metricsMap.has(g.websiteId)) {
      metricsMap.set(g.websiteId, { total: 0, up: 0, latSum: 0, latCount: 0, downRegions: new Set() })
    }

    // get existing
    const m = metricsMap.get(g.websiteId)!

    m.total += g._count._all

    if (g.status < 400) {
      m.up += g._count._all
      if (g._avg.responseTimeMs) {
        m.latSum += g._avg.responseTimeMs * g._count._all
        m.latCount += g._count._all
      }
    } else {
      m.downRegions.add(g.regionId)
    }
  }

  // format for DB entry
  const metrics = Array.from(metricsMap.entries()).map(([websiteId, m]) => ({
    websiteId,
    windowStart: lastWindowStart,
    windowEnd: windowStart,
    finalStatus: (m.up / m.total) >= 0.75 ? 200 : 500,
    uptimePercent: (m.up / m.total) * 100,
    avgResponseTimeMs: m.latCount > 0 ? Math.round(m.latSum / m.latCount) : null,
    regionsDownCount: m.downRegions.size,
    regionsDownList: Array.from(m.downRegions)
  }))

  await prisma.websiteMetric.createMany({ data: metrics })
  console.log(`Compiled ${metrics.length} hourly metrics for ${lastWindowStart.toISOString()}`)

  return { compiled: metrics.length, window: lastWindowStart.toISOString() }
}