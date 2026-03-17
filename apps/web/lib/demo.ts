// lib/demoData.ts

const now = new Date("2026-03-17T15:00:00Z")

const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString()

// 10 ticks per region, spaced 3 mins apart (last 30 mins)
// ap-south-1: stable ~400ms
// eu-west-1: stable ~300ms, goes down at tick 5-7 (resolved regional incident)
// us-east-1: stable ~500ms, goes down at tick 8-10 (active global incident)

const regionTicks = [
  // ap-south-1 — normal throughout, spikes during global incident
  { status: 500, createdAt: new Date(minsAgo(27)), responseTimeMs: 412, region: { name: "ap-south-1" } },
  { status: 500, createdAt: new Date(minsAgo(24)), responseTimeMs: 398, region: { name: "ap-south-1" } },
  { status: 400, createdAt: new Date(minsAgo(21)), responseTimeMs: 421, region: { name: "ap-south-1" } },
  { status: 400, createdAt: new Date(minsAgo(18)), responseTimeMs: 435, region: { name: "ap-south-1" } },
  { status: 400, createdAt: new Date(minsAgo(15)), responseTimeMs: 408, region: { name: "ap-south-1" } },
  { status: 400, createdAt: new Date(minsAgo(12)), responseTimeMs: 390, region: { name: "ap-south-1" } },
  { status: 400, createdAt: new Date(minsAgo(9)),  responseTimeMs: 415, region: { name: "ap-south-1" } },
  { status: 400,   createdAt: new Date(minsAgo(6)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },
  { status: 400,   createdAt: new Date(minsAgo(3)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },
  { status: 400,   createdAt: new Date(minsAgo(0)),  responseTimeMs: 0,   region: { name: "ap-south-1" } },

  // eu-west-1 — goes down for 3 ticks then recovers (resolved regional incident)
  { status: 500, createdAt: new Date(minsAgo(27)), responseTimeMs: 310, region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(24)), responseTimeMs: 298, region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(21)), responseTimeMs: 322, region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(18)), responseTimeMs: 305, region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(15)), responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(12)), responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 0,   createdAt: new Date(minsAgo(9)),  responseTimeMs: 0,   region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(6)),  responseTimeMs: 318, region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(3)),  responseTimeMs: 302, region: { name: "eu-west-1" } },
  { status: 500, createdAt: new Date(minsAgo(0)),  responseTimeMs: 295, region: { name: "eu-west-1" } },

  // us-east-1 — goes down last 3 ticks (part of active global incident))
  { status: 400, createdAt: new Date(minsAgo(27)), responseTimeMs: 512, region: { name: "us-east-1" } },
  { status: 400, createdAt: new Date(minsAgo(24)), responseTimeMs: 498, region: { name: "us-east-1" } },
  { status: 400, createdAt: new Date(minsAgo(21)), responseTimeMs: 521, region: { name: "us-east-1" } },
  { status: 400, createdAt: new Date(minsAgo(18)), responseTimeMs: 505, region: { name: "us-east-1" } },
  { status: 400, createdAt: new Date(minsAgo(15)), responseTimeMs: 488, region: { name: "us-east-1" } },
  { status: 500, createdAt: new Date(minsAgo(12)), responseTimeMs: 510, region: { name: "us-east-1" } },
  { status: 500, createdAt: new Date(minsAgo(9)),  responseTimeMs: 495, region: { name: "us-east-1" } },
  { status: 400,   createdAt: new Date(minsAgo(6)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
  { status: 400,   createdAt: new Date(minsAgo(3)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
  { status: 400,   createdAt: new Date(minsAgo(0)),  responseTimeMs: 0,   region: { name: "us-east-1" } },
]

// 24 hourly metrics (last 24 hours), mostly healthy with a dip during the regional incident
const metrics = Array.from({ length: 24 }, (_, i) => {
  const windowStart = new Date(now.getTime() - (24 - i) * 60 * 60 * 1000).toISOString()
  const windowEnd   = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000).toISOString()

  // hour 10 = regional incident (eu-west-1 down)
  // hour 22-23 = global incident (ap-south-1 + us-east-1 down, ongoing)
  const isRegionalIncidentHour = i === 10
  const isGlobalIncidentHour   = i >= 22

  const uptimePercent     = isGlobalIncidentHour ? 33 : isRegionalIncidentHour ? 66 : 99.5 + Math.random() * 0.5
  const avgResponseTimeMs = isGlobalIncidentHour ? null : Math.round(420 + Math.random() * 80)
  const regionsDownList   = isGlobalIncidentHour
    ? ["ap-south-1", "eu-west-1", "us-east-1"]
    : isRegionalIncidentHour
    ? ["eu-west-1"]
    : []

  return {
    windowStart: new Date(windowStart),
    windowEnd: new Date(windowEnd),
    uptimePercent:     Math.round(uptimePercent * 100) / 100,
    avgResponseTimeMs,
    regionsDownList,
    regionsDownCount:  regionsDownList.length,
  }
})

export const demoData = {
  website: {
    id: "demo",
    name: "Demo Website",
    url: "https://demo.example.com",
    currentStatus: 500,
    lastChecked: new Date(minsAgo(0)),
  },

  metrics,

  incidents: [
    // Active global incident — ongoing
    {
      id: "inc_global",
      websiteId: "demo",
      type: "Global",
      status: "Ongoing",
      cause: "ap-south-1, eu-west-1, us-east-1",
      startedAt: new Date(minsAgo(6)),
      endedAt: null,
      createdAt: new Date(minsAgo(6)),
    },
    // Resolved regional incident — 15 mins ago, lasted 9 mins
    {
      id: "inc_regional",
      websiteId: "demo",
      type: "Regional",
      status: "Resolved",
      cause: "eu-west-1",
      startedAt: new Date(minsAgo(15)),
      endedAt: new Date(minsAgo(6)),
      createdAt: new Date(minsAgo(15)),
    },
  ],

  regionTicks,

  regionSummary: [
    { name: "ap-south-1", avgLatency: 412, totalChecks: 480 },
    { name: "eu-west-1",  avgLatency: 308, totalChecks: 480 },
    { name: "us-east-1",  avgLatency: 505, totalChecks: 480 },
  ],

  uptime: {
    h24: 72.4,
    d7:  98.1,
    d30: 99.3,
  },

  latency: {
    h24: 455,
    d7:  480,
    d30: 495,
  },
}