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

  // Pooled "ALL" rows only, and only for this user's sites.
  const rows = await prisma.websiteMetric.findMany({
    where: {
      websiteId: { in: websites.map((w) => w.id) },
      regionId: "ALL",
      windowStart: { gte: oneDayAgo },
    },
    select: { websiteId: true, checks: true, failures: true, avgResponseTimeMs: true },
  })

  const byWebsite = new Map<string, typeof rows>()
  for (const r of rows) {
    const list = byWebsite.get(r.websiteId) ?? []
    list.push(r)
    byWebsite.set(r.websiteId, list)
  }

  return websites.map((site) => {
    const siteRows = byWebsite.get(site.id) ?? []

    // Uptime = good checks / all checks (never average the hourly percentages)
    const checks = siteRows.reduce((s, r) => s + r.checks, 0)
    const failures = siteRows.reduce((s, r) => s + r.failures, 0)

    // Latency weighted by each hour's successful checks
    let latSum = 0
    let latN = 0
    for (const r of siteRows) {
      if (r.avgResponseTimeMs === null) continue
      const w = r.checks - r.failures
      latSum += r.avgResponseTimeMs * w
      latN += w
    }

    return {
      ...site,
      uptime24h: checks ? ((checks - failures) / checks) * 100 : null, // null = no data yet
      avgResponseTime: latN ? Math.round(latSum / latN) : null,
    }
  })
}