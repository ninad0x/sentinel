import { prisma } from "@repo/db/client"
import { MonitorData } from "./types"
import { getDemoData } from "./demo"

type Row = { checks: number; failures: number; avgResponseTimeMs: number | null }

// Uptime = good checks / all checks. Never average the hourly percentages.
const uptimeOf = (rows: Pick<Row, "checks" | "failures">[]) => {
  const checks = rows.reduce((s, r) => s + r.checks, 0)
  const failures = rows.reduce((s, r) => s + r.failures, 0)
  return checks ? ((checks - failures) / checks) * 100 : null
}

// Latency weighted by the successful checks of each hour (avg is only over good responses).
const latencyOf = (rows: Row[]) => {
  let sum = 0
  let n = 0
  for (const r of rows) {
    if (r.avgResponseTimeMs === null) continue
    const w = r.checks - r.failures
    sum += r.avgResponseTimeMs * w
    n += w
  }
  return n ? Math.round(sum / n) : 0
}

export const getMonitorData = async (websiteId: string): Promise<MonitorData | null> => {
  if (websiteId === "demo") return getDemoData()

  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { id: true, name: true, url: true, currentStatus: true, lastChecked: true }
  })

  if (!website) return null

  const now = Date.now()
  const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000)
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

  const [regions, metrics, monthlyMetrics, incidents, regionTicks] = await Promise.all([
    prisma.region.findMany({ select: { id: true, name: true } }),

    // last 24h: regional rows + ALL row (split by regionId in the UI)
    prisma.websiteMetric.findMany({
      where: { websiteId, windowStart: { gte: oneDayAgo } },
      select: {
        windowStart: true, regionId: true, checks: true, failures: true,
        uptimePercent: true, avgResponseTimeMs: true,
        minMs: true, maxMs: true, p50Ms: true, p95Ms: true, p99Ms: true,
      },
      orderBy: { windowStart: "asc" },
    }),

    // last 30d: pooled "ALL" rows only, so nothing is counted twice
    prisma.websiteMetric.findMany({
      where: { websiteId, regionId: "ALL", windowStart: { gte: thirtyDaysAgo } },
      select: {
        windowStart: true, checks: true, failures: true,
        uptimePercent: true, avgResponseTimeMs: true, p95Ms: true,
      },
      orderBy: { windowStart: "asc" },
    }),

    prisma.incident.findMany({
      where: { websiteId },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),

    // last 1 hour raw ticks for the live regional graph
    prisma.websiteTick.findMany({
      where: { websiteId, createdAt: { gte: oneHourAgo } },
      select: { createdAt: true, roundAt: true, responseTimeMs: true, region: { select: { name: true } }, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  // Per-region cards (last 24h) from the regional metric rows
  const regionSummary = regions.flatMap((region) => {
    const rows = metrics.filter((m) => m.regionId === region.id)
    if (rows.length === 0) return []
    const p95s = rows.map((r) => r.p95Ms).filter((x): x is number => x !== null)
    const maxs = rows.map((r) => r.maxMs).filter((x): x is number => x !== null)
    const hasP50 = rows.some((r) => r.p50Ms !== null)
    return [{
      name: region.name,
      avgLatency: latencyOf(rows),
      p95Latency: p95s.length ? Math.max(...p95s) : null,
      p50Latency: hasP50 ? latencyOf(rows.map((r) => ({ ...r, avgResponseTimeMs: r.p50Ms }))) : null,
      maxLatency: maxs.length ? Math.max(...maxs) : null,
      uptimePercent: uptimeOf(rows) ?? 0,
      totalChecks: rows.reduce((s, r) => s + r.checks, 0),
    }]
  })

  const last24h = monthlyMetrics.filter((m) => m.windowStart >= oneDayAgo)
  const last7d = monthlyMetrics.filter((m) => m.windowStart >= sevenDaysAgo)
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })

  const byDay = new Map<string, { checks: number; failures: number; worstP95: number | null }>()
  for (const m of monthlyMetrics) {
    const key = dayKey(m.windowStart)
    const d = byDay.get(key) ?? { checks: 0, failures: 0, worstP95: null }
    d.checks += m.checks
    d.failures += m.failures
    if (m.p95Ms !== null && (d.worstP95 === null || m.p95Ms > d.worstP95)) d.worstP95 = m.p95Ms
    byDay.set(key, d)
  }

  const dailyUptime = Array.from({ length: 30 }, (_, i) => {
    const date = dayKey(new Date(now - (29 - i) * 86_400_000))
    const d = byDay.get(date)
    return {
      date,
      uptime: d && d.checks > 0 ? ((d.checks - d.failures) / d.checks) * 100 : null,
      p95: d?.worstP95 ?? null,
    }
  })

  return {
    website,
    regions,
    metrics,
    monthlyMetrics,
    incidents,
    regionTicks,
    regionSummary,
    dailyUptime,

    uptime: {
      h24: uptimeOf(last24h) ?? 0,
      d7: uptimeOf(last7d) ?? 0,
      d30: uptimeOf(monthlyMetrics) ?? 0,
    },

    latency: {
      h24: latencyOf(last24h),
      d7: latencyOf(last7d),
      d30: latencyOf(monthlyMetrics),
    },
  }
}