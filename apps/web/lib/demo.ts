// Demo data for /monitor/demo
// Everything is generated relative to "now", so it never goes stale.
// Hourly rows, the 30-day bar, uptime cards and the incident list all come from the
// same generated numbers, so they agree with each other.

import { MonitorData } from "./types"

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const ROUND = 2 * MIN // check interval
const CHECKS_PER_HOUR = HOUR / ROUND // 30 per region per hour

const REGIONS = [
  { id: "demo-ap", name: "ap-south-1", base: 412 },
  { id: "demo-eu", name: "eu-west-1", base: 308 },
  { id: "demo-us", name: "us-east-1", base: 505 },
]

// Past incidents. Hours inside them are generated as failing for the listed regions.
const INCIDENT_SPECS = [
  { id: "demo-inc-1", daysAgo: 6, hours: 2, down: ["us-east-1"] }, // Regional, 120 min
  { id: "demo-inc-2", daysAgo: 14, hours: 1, down: ["eu-west-1", "us-east-1"] }, // Global, 60 min
  { id: "demo-inc-3", daysAgo: 22, hours: 1, down: ["ap-south-1"] }, // Regional, 60 min
]

type Stats = {
  checks: number
  failures: number
  avg: number | null
  min: number | null
  max: number | null
  p50: number | null
  p95: number | null
  p99: number | null
}

// Small deterministic random in [0, 1): the same hour always gives the same numbers.
const rand = (seed: number) => {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const dayKey = (ms: number) =>
  new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) // "2026-10-04"

// Same maths as getMonitorData: uptime = good checks / all checks, latency weighted by good checks.
type Row = { checks: number; failures: number; avgResponseTimeMs: number | null }

const uptimeOf = (rows: Pick<Row, "checks" | "failures">[]) => {
  const checks = rows.reduce((s, r) => s + r.checks, 0)
  const failures = rows.reduce((s, r) => s + r.failures, 0)
  return checks ? ((checks - failures) / checks) * 100 : null
}

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

const noLatency = { avg: null, min: null, max: null, p50: null, p95: null, p99: null }

// Combine regional stats into the pooled "ALL" row.
const pool = (all: Stats[]): Stats => {
  const checks = all.reduce((s, x) => s + x.checks, 0)
  const failures = all.reduce((s, x) => s + x.failures, 0)
  const good = all.filter((x) => x.avg !== null)
  if (good.length === 0) return { checks, failures, ...noLatency }

  const weight = (x: Stats) => x.checks - x.failures
  const total = good.reduce((s, x) => s + weight(x), 0)
  const weighted = (pick: (x: Stats) => number) =>
    Math.round(good.reduce((s, x) => s + pick(x) * weight(x), 0) / total)

  return {
    checks,
    failures,
    avg: weighted((x) => x.avg!),
    min: Math.min(...good.map((x) => x.min!)),
    max: Math.max(...good.map((x) => x.max!)),
    p50: weighted((x) => x.p50!),
    p95: Math.max(...good.map((x) => x.p95!)),
    p99: Math.max(...good.map((x) => x.p99!)),
  }
}

export function getDemoData(): MonitorData {
  const now = Date.now()
  const currentHour = Math.floor(now / HOUR) * HOUR

  // ---------- incidents ----------
  const incidentWindows = INCIDENT_SPECS.map((i) => {
    const startedAt = Math.floor((now - i.daysAgo * DAY) / HOUR) * HOUR
    return { ...i, startedAt, endedAt: startedAt + i.hours * HOUR }
  })

  const isDown = (region: string, hourStart: number) =>
    incidentWindows.some(
      (i) => i.down.includes(region) && hourStart >= i.startedAt && hourStart < i.endedAt
    )

  const incidents = incidentWindows
    .map((i) => ({
      id: i.id,
      websiteId: "demo",
      startedAt: new Date(i.startedAt),
      endedAt: new Date(i.endedAt),
      status: "Resolved",
      type: (i.down.length >= 2 ? "Global" : "Regional") as "Global" | "Regional",
      cause: i.down.join(", "),
    }))
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())

  // ---------- hourly stats for the last 30 days (oldest first) ----------
  const hours = Array.from({ length: 720 }, (_, i) => currentHour - (720 - i) * HOUR)

  const regionHour = (idx: number, hourStart: number): Stats => {
    const region = REGIONS[idx]!
    const failures = isDown(region.name, hourStart) ? CHECKS_PER_HOUR : 0
    if (failures === CHECKS_PER_HOUR) return { checks: CHECKS_PER_HOUR, failures, ...noLatency }

    const seed = Math.floor(hourStart / HOUR) * 10 + idx
    const avg = Math.round(region.base * (0.92 + 0.16 * rand(seed)))
    return {
      checks: CHECKS_PER_HOUR,
      failures,
      avg,
      min: Math.round(avg * 0.7),
      max: Math.round(avg * 1.8),
      p50: Math.round(avg * 0.96),
      p95: Math.round(avg * 1.3),
      p99: Math.round(avg * 1.55),
    }
  }

  const hourly = hours.map((hourStart) => {
    const per = REGIONS.map((_, idx) => regionHour(idx, hourStart))
    return { hourStart, per, all: pool(per) }
  })

  const metricRow = (hourStart: number, regionId: string, s: Stats) => ({
    windowStart: new Date(hourStart),
    regionId,
    checks: s.checks,
    failures: s.failures,
    uptimePercent: (100 * (s.checks - s.failures)) / s.checks,
    avgResponseTimeMs: s.avg,
    minMs: s.min,
    maxMs: s.max,
    p50Ms: s.p50,
    p95Ms: s.p95,
    p99Ms: s.p99,
  })

  // last 24h: one row per region + the pooled "ALL" row, for every hour
  const last24 = hourly.slice(-24)
  const metrics = last24.flatMap((h) => [
    ...REGIONS.map((r, idx) => metricRow(h.hourStart, r.id, h.per[idx]!)),
    metricRow(h.hourStart, "ALL", h.all),
  ])

  // last 30 days: "ALL" rows only
  const monthlyMetrics = hourly.map((h) => {
    const m = metricRow(h.hourStart, "ALL", h.all)
    return {
      windowStart: m.windowStart,
      checks: m.checks,
      failures: m.failures,
      uptimePercent: m.uptimePercent,
      avgResponseTimeMs: m.avgResponseTimeMs,
      p95Ms: m.p95Ms,
    }
  })

  // ---------- live ticks, last hour ----------
  const roundNow = Math.floor(now / ROUND) * ROUND
  const regionTicks: {
    status: number
    createdAt: Date
    roundAt: Date
    responseTimeMs: number | null
    region: { name: string }
  }[] = []

  for (let k = 29; k >= 0; k--) {
    const roundAt = roundNow - k * ROUND
    REGIONS.forEach((r, idx) => {
      // eu-west-1 runs about 25 seconds behind, like the real deployment
      const offset = idx === 1 ? 24_000 + Math.round(rand(roundAt / ROUND) * 6_000) : 2_000 + idx * 2_000
      const createdAt = roundAt + offset
      if (createdAt > now) return

      // one failed check ~40 min ago: a single blip, so no incident (needs 2 bad rounds in a row)
      const failed = r.name === "us-east-1" && k === 20
      regionTicks.push({
        status: failed ? 0 : 200,
        createdAt: new Date(createdAt),
        roundAt: new Date(roundAt),
        responseTimeMs: failed ? null : Math.round(r.base * (0.85 + 0.3 * rand(roundAt / ROUND + idx * 101))),
        region: { name: r.name },
      })
    })
  }
  regionTicks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  // ---------- region cards (last 24h, from the regional rows) ----------
  const regionSummary = REGIONS.map((r, idx) => {
    const rows = last24.map((h) => {
      const s = h.per[idx]!
      return { checks: s.checks, failures: s.failures, avgResponseTimeMs: s.avg, p50: s.p50, p95: s.p95, max: s.max }
    })
    const p95s = rows.map((x) => x.p95).filter((x): x is number => x !== null)
    const maxs = rows.map((x) => x.max).filter((x): x is number => x !== null)
    return {
      name: r.name,
      avgLatency: latencyOf(rows),
      p95Latency: p95s.length ? Math.max(...p95s) : null,
      p50Latency: latencyOf(rows.map((x) => ({ ...x, avgResponseTimeMs: x.p50 }))),
      maxLatency: maxs.length ? Math.max(...maxs) : null,
      uptimePercent: uptimeOf(rows) ?? 0,
      totalChecks: rows.reduce((s, x) => s + x.checks, 0),
    }
  })

  // ---------- 30-day bar ----------
  const byDay = new Map<string, { checks: number; failures: number; worstP95: number | null }>()
  for (const m of monthlyMetrics) {
    const key = dayKey(m.windowStart.getTime())
    const d = byDay.get(key) ?? { checks: 0, failures: 0, worstP95: null }
    d.checks += m.checks
    d.failures += m.failures
    if (m.p95Ms !== null && (d.worstP95 === null || m.p95Ms > d.worstP95)) d.worstP95 = m.p95Ms
    byDay.set(key, d)
  }

  const dailyUptime = Array.from({ length: 30 }, (_, i) => {
    const date = dayKey(now - (29 - i) * DAY)
    const d = byDay.get(date)
    return {
      date,
      uptime: d && d.checks > 0 ? ((d.checks - d.failures) / d.checks) * 100 : null,
      p95: d?.worstP95 ?? null,
    }
  })

  // ---------- uptime and latency cards ----------
  const last7d = monthlyMetrics.filter((m) => m.windowStart.getTime() >= now - 7 * DAY)
  const last24h = monthlyMetrics.filter((m) => m.windowStart.getTime() >= now - DAY)

  const newest = regionTicks[regionTicks.length - 1]

  return {
    website: {
      id: "demo",
      name: "Demo Website",
      url: "https://sentinel.ninad.codes",
      currentStatus: 200,
      lastChecked: newest ? newest.createdAt : new Date(now),
    },
    regions: REGIONS.map(({ id, name }) => ({ id, name })),
    metrics,
    monthlyMetrics,
    incidents,
    regionTicks,
    regionSummary,
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
    dailyUptime,
  }
}