import { prisma } from "@repo/db/client"

export const getDashboardData = async (userId: string) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const websites = await prisma.website.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      url: true,
      currentStatus: true,
      lastChecked: true,
      incidents: {
        where: { endedAt: null },
        take: 1,
        select: { id: true }
      }
    }
  })

  const metrics = await prisma.websiteMetric.groupBy({
    by: ["websiteId"],
    where: { windowStart: { gte: oneDayAgo } },
    _avg: {
      uptimePercent: true,
      avgResponseTimeMs: true
    }
  })

  const metricsMap = new Map(
    metrics.map(m => [m.websiteId, m])
  )

  return websites.map(site => {
    const m = metricsMap.get(site.id)

    return {
      ...site,
      uptime24h: m?._avg.uptimePercent ?? 100,
      avgResponseTime: m?._avg.avgResponseTimeMs ?? null
    }
  })
}