
const now = new Date()

const minsAgo  = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
const daysAgo  = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

// ─── REGION TICKS (last 30 mins, 10 per region) ──────────────────────────────

const regionTicks = [
  // ap-south-1
  { status: 200, createdAt: new Date(minsAgo(27)), responseTimeMs: 412, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(24)), responseTimeMs: 398, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(21)), responseTimeMs: 421, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(18)), responseTimeMs: 435, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(15)), responseTimeMs: 408, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(12)), responseTimeMs: 390, region: { name: "ap-south-1" } },
  { status: 200, createdAt: new Date(minsAgo(9)),  responseTimeMs: 415, region: { name: "ap-south-1" } },
  { status: 200,   createdAt: new Date(minsAgo(6)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },
  { status: 200,   createdAt: new Date(minsAgo(3)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },
  { status: 200,   createdAt: new Date(minsAgo(0)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },

  // eu-west-1 — went down for 3 ticks, now recovered
  { status: 200, createdAt: new Date(minsAgo(27)), responseTimeMs: 310, region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(24)), responseTimeMs: 298, region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(21)), responseTimeMs: 322, region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(18)), responseTimeMs: 305, region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(15)), responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(12)), responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(9)),  responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(6)),  responseTimeMs: 318, region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(3)),  responseTimeMs: 302, region: { name: "eu-west-1" } },
  { status: 200, createdAt: new Date(minsAgo(0)),  responseTimeMs: 295, region: { name: "eu-west-1" } },

  // us-east-1 — down last 3 ticks (global incident)
  { status: 200, createdAt: new Date(minsAgo(27)), responseTimeMs: 512, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(24)), responseTimeMs: 498, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(21)), responseTimeMs: 521, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(18)), responseTimeMs: 505, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(15)), responseTimeMs: 488, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(12)), responseTimeMs: 510, region: { name: "us-east-1" } },
  { status: 200, createdAt: new Date(minsAgo(9)),  responseTimeMs: 495, region: { name: "us-east-1" } },
  { status: 200,   createdAt: new Date(minsAgo(6)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
  { status: 200,   createdAt: new Date(minsAgo(3)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
  { status: 200,   createdAt: new Date(minsAgo(0)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
]

// ─── 24H METRICS (hourly, last 24 hours) ─────────────────────────────────────

const metrics = Array.from({ length: 24 }, (_, i) => {
  const windowStart = hoursAgo(24 - i)
  const windowEnd   = hoursAgo(23 - i)

  const isRegionalHour = i === 10
  const isGlobalHour   = i >= 22

  const uptimePercent     = isGlobalHour ? 33 : isRegionalHour ? 66 : 99.5 + Math.random() * 0.5
  const avgResponseTimeMs = isGlobalHour ? null : Math.round(420 + Math.random() * 80)
  const regionsDownList   = isGlobalHour ? ["ap-south-1", "us-east-1"] : isRegionalHour ? ["eu-west-1"] : []

  return {
    windowStart,
    windowEnd,
    uptimePercent:    Math.round(uptimePercent * 100) / 100,
    avgResponseTimeMs,
    regionsDownList,
    regionsDownCount: regionsDownList.length,
  }
})

// ─── MONTHLY METRICS (hourly rows for last 30 days, ~720 rows) ───────────────
// Simulate realistic uptime with a few bad days scattered across the month

const monthlyMetrics = Array.from({ length: 30 * 24 }, (_, i) => {
  const windowStart = new Date(now.getTime() - (30 * 24 - i) * 60 * 60 * 1000)

  const dayIndex = Math.floor(i / 24) // ✅ FIXED (important)

  let uptimePercent

  // EXACT control of full days
  if (dayIndex === 3) {
    uptimePercent = 55 
  } else if ([5, 15].includes(dayIndex)) {
    uptimePercent = 80
  } else {
    uptimePercent = 97 + Math.random() * 2
  }

  return {
    windowStart,
    uptimePercent: Math.round(uptimePercent * 100) / 100,
    avgResponseTimeMs:
      uptimePercent < 70 ? null : Math.round(400 + Math.random() * 100),
  }
})

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export const demoData = {
  website: {
    id: "demo",
    name: "Demo Website",
    url: "https://sentinel.ninad1.me/",
    currentStatus: 200,
    lastChecked: new Date(minsAgo(0)),
  },

  metrics,
  monthlyMetrics,

incidents: [
  {
    id: "inc_red",
    websiteId: "demo",
    type: "Global",
    status: "Resolved",
    cause: "us-east-1",
    startedAt: daysAgo(29 - 3), 
    endedAt: new Date(daysAgo(29 - 3).getTime() + 3 * 60 * 60 * 1000),
    createdAt: daysAgo(29 - 3),
  },

  {
    id: "inc_y1",
    websiteId: "demo",
    type: "Regional",
    status: "Resolved",
    cause: "eu-west-1",
    startedAt: daysAgo(29 - 7),
    endedAt: new Date(daysAgo(29 - 7).getTime() + 2 * 60 * 60 * 1000),
    createdAt: daysAgo(29 - 7),
  },

  {
    id: "inc_y2",
    websiteId: "demo",
    type: "Regional",
    status: "Resolved",
    cause: "ap-south-1",
    startedAt: daysAgo(29 - 12),
    endedAt: new Date(daysAgo(29 - 12).getTime() + 2 * 60 * 60 * 1000),
    createdAt: daysAgo(29 - 12),
  },
],

  regionTicks,

  regionSummary: [
    { name: "ap-south-1", avgLatency: 412, totalChecks: 480 },
    { name: "eu-west-1",  avgLatency: 308, totalChecks: 480 },
    { name: "us-east-1",  avgLatency: 505, totalChecks: 480 },
  ],

  uptime: { h24: 99.9, d7: 99.9, d30: 97.2 },
  latency: { h24: 455, d7: 480, d30: 495 },
}