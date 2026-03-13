import { prisma } from "@repo/db/client"
import { sendAlertEmail } from "./sendAlertEmail"
import { IncidentEmailParams } from "./emails/incidentAlertEmail"

export async function checkIncidentForWebsite(websiteId: string): Promise<void> {
  const WINDOW_MS = 3 * 60 * 1000
  const cutoff = new Date(Date.now() - WINDOW_MS)

  try {
    const ticks = await prisma.websiteTick.findMany({
      where: { websiteId, createdAt: { gte: cutoff } },
      orderBy: { createdAt: "desc" },
      include: {
        region: { select: { name: true } },
        website: { include: { user: { select: { email: true } } } }
      }
    })

    if (ticks.length === 0) return

    const website = ticks[0]!.website

    // latest tick per region
    const byRegion = new Map<string, typeof ticks[number]>()
    for (const tick of ticks) {
      if (!byRegion.has(tick.regionId)) byRegion.set(tick.regionId, tick)
    }

    const regions = Array.from(byRegion.values())
    if (regions.length < 2) return

    const downRegions = regions.filter(t => t.status === 0 || t.status >= 400)

    const total = regions.length
    const down = downRegions.length

    let state: "UP" | "REGIONAL" | "GLOBAL"

    if (down === 0) state = "UP"
    else if (down === total) state = "GLOBAL"
    else if (down >= 2) state = "REGIONAL"
    else state = "UP"

    const incident = await prisma.incident.findFirst({
      where: { websiteId, endedAt: null }
    })

    const baseEmail: Omit<IncidentEmailParams, "startedAt" | "status"> = {
      to: website.user.email,
      siteName: website.name,
      siteUrl: website.url,
      incidentType: state === "GLOBAL" ? "Global" : "Regional",
      downRegions: downRegions.map(t => t.region.name),
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/monitor/${websiteId}`,
    }

    // CREATE INCIDENT
    if (!incident && state !== "UP") {
      await prisma.incident.create({
        data: {
          websiteId,
          type: state === "GLOBAL" ? "Global" : "Regional",
          status: "Ongoing",
          cause: downRegions.map(t => t.region.name).join(", ")
        }
      })

      await prisma.website.update({
        where: { id: websiteId },
        data: { currentStatus: 500 }
      })

      await sendAlertEmail({
        ...baseEmail,
        startedAt: new Date(),
        status: "DOWN"
      })
      return
    }

    // UPGRADE REGIONAL TO GLOBAL
    if (incident && incident.type === "Regional" && state === "GLOBAL" ) {
      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          type: "Global",
          cause: downRegions.map(t => t.region.name).join(", ")
        }
      })

      await sendAlertEmail({
        ...baseEmail,
        startedAt: incident.startedAt,
        status: "DOWN"
      })
      return
    }

    // RESOLVE INCIDENT
    if (incident && state === "UP") {
      await prisma.incident.update({
        where: { id: incident.id },
        data: { endedAt: new Date(), status: "Resolved" }
      })

      await prisma.website.update({
        where: { id: websiteId },
        data: { currentStatus: 200 }
      })

      await sendAlertEmail({
        ...baseEmail,
        incidentType: incident.type,
        startedAt: new Date(),
        status: "RESOLVED"
      })
    }

  } catch (err) {
    console.error(`Error checking ${websiteId}:`, err)
  }
}