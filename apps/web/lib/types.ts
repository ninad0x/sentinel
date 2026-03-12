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
    website: z.string(),
    status: z.number(),
    latency: z.number().nullable(),
    timestamp: z.number(),
    details: z.string()
})

export const WebsiteTickBatch = z.object({
    region: z.string(),
    results: z.array(WebsiteTickSchema)
})


export type MonitorData = {
  website: Prisma.WebsiteGetPayload<{
    select: {
      id: true
      name: true
      url: true
      currentStatus: true
      lastChecked: true
    }
  }>

  metrics: Prisma.WebsiteMetricGetPayload<{
    select: {
      windowStart: true,
      uptimePercent: true,
      regionsDownList: true,
      avgResponseTimeMs: true,
      regionsDownCount: true
    }
  }>[]

  incidents: Prisma.IncidentGetPayload<{}>[]


  regionTicks: Prisma.WebsiteTickGetPayload<{
    select: {
      createdAt: true
      responseTimeMs: true
      region: { select: { name: true } }
    }
  }>[]

  regionSummary: {
    name: string;
    avgLatency: number;
    totalChecks: number;
  }[]

  uptime: {
    h24: number
    d7: number
    d30: number
  }

  latency: {
    h24: number
    d7: number
    d30: number
  }

}

export type CardData = {
  uptime24h: number;
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


