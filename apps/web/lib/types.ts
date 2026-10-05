import z from "zod";
import { Prisma } from "@prisma/client"

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    name: z.string()
})

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
})

const WebsiteTickSchema = z.object({
    id: z.string(),
    status: z.number(),
    latency: z.number().nullable(),
    timestamp: z.number(),
    details: z.string().nullable().optional()
})

export const WebsiteTickBatch = z.object({
    region: z.string(),
    roundAt: z.string().datetime(),
    results: z.array(WebsiteTickSchema)
})

// WebsiteMetric now has 4 rows per site per hour:
// one per region (regionId = Region.id) + one pooled row (regionId = "ALL").
type MetricRow = Prisma.WebsiteMetricGetPayload<{
  select: {
    windowStart: true
    regionId: true
    checks: true
    failures: true
    uptimePercent: true
    avgResponseTimeMs: true
    minMs: true
    maxMs: true
    p50Ms: true
    p95Ms: true
    p99Ms: true
  }
}>

export type MonitorData = {
  website: Prisma.WebsiteGetPayload<{
    select: { id: true; name: true; url: true; currentStatus: true; lastChecked: true }
  }>

  // Region id -> name lookup (metric.regionId is a cuid, or "ALL")
  regions: { id: string; name: string }[]

  // last 24h hourly metrics, ALL + regional rows -> 24h trend graph, per-region cards
  metrics: MetricRow[]

  // last 30 days hourly metrics, ALL rows only (regionId = "ALL") -> green bar + uptime/latency
  monthlyMetrics: Pick<
    MetricRow,
    "windowStart" | "checks" | "failures" | "uptimePercent" | "avgResponseTimeMs" | "p95Ms"
  >[]

  incidents: Prisma.IncidentGetPayload<{}>[]

  dailyUptime: { date: string; uptime: number | null; p95: number | null }[]

  regionTicks: Prisma.WebsiteTickGetPayload<{
    select: {
      status: true
      createdAt: true
      roundAt: true
      responseTimeMs: true
      region: { select: { name: true } }
    }
  }>[]

  regionSummary: {
    name: string
    avgLatency: number
    p95Latency: number | null
    p50Latency: number | null
    maxLatency: number | null
    uptimePercent: number
    totalChecks: number
  }[]

  // compute as sum(checks - failures) / sum(checks), never average uptimePercent
  uptime: { h24: number; d7: number; d30: number }
  latency: { h24: number; d7: number; d30: number }
}

export type CardData = {
  uptime24h: number | null;
  avgResponseTime: number | null;
  id: string;
  url: string;
  name: string;
  currentStatus: number;
  lastChecked: Date | null;
  incidents: {
      id: string;
  }[];
}

export type signUpValues = z.infer<typeof signUpSchema>
export type signInValues = z.infer<typeof signInSchema>
export type WebsiteTickType = z.infer<typeof WebsiteTickSchema>
export type MonitorProps = { data: MonitorData }