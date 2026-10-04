import { prisma } from "@repo/db/client"
import { sendAlertEmail } from "./sendAlertEmail"
import { IncidentEmailParams } from "./emails/incidentAlertEmail"

// After this long, a round is judged with whichever regions have reported (slow EU ~30s).
const ROUND_GRACE_MS = 90_000
// How far back to look for rounds.
const LOOKBACK_MS = 10 * 60_000

const isDown = (status: number) => status === 0 || status >= 400

type IncidentKind = "Global" | "Regional"
type Round = { roundAt: Date; reported: number; down: string[] }
type Decision =
  | { action: "none" }
  | { action: "open"; type: IncidentKind }
  | { action: "upgrade" }
  | { action: "close" }

// Pure decision logic. `latest` and `previous` are the two most recent complete rounds.
//   open:    2 rounds in a row with at least one region down
//   type:    2+ regions down in the latest round = Global, exactly 1 = Regional
//   upgrade: an open Regional incident whose latest round now has 2+ regions down
//   close:   2 rounds in a row with every region OK
export function decide(
  latest: Round,
  previous: Round,
  open: { type: IncidentKind } | null
): Decision {
  // Fewer than 2 regions reported: not enough data to judge, change nothing.
  if (latest.reported < 2 || previous.reported < 2) return { action: "none" }

  const latestBad = latest.down.length > 0
  const previousBad = previous.down.length > 0
  const type: IncidentKind = latest.down.length >= 2 ? "Global" : "Regional"

  if (!open) {
    return latestBad && previousBad ? { action: "open", type } : { action: "none" }
  }
  if (!latestBad && !previousBad) return { action: "close" }
  if (open.type === "Regional" && type === "Global") return { action: "upgrade" }
  return { action: "none" }
}

export async function checkIncidentForWebsite(websiteId: string): Promise<void> {
  try {
    const [totalRegions, ticks, website, incident] = await Promise.all([
      prisma.region.count(),
      prisma.websiteTick.findMany({
        where: { websiteId, roundAt: { gte: new Date(Date.now() - LOOKBACK_MS) } },
        select: { roundAt: true, status: true, region: { select: { name: true } } },
      }),
      prisma.website.findUnique({
        where: { id: websiteId },
        select: { name: true, url: true, user: { select: { email: true } } },
      }),
      prisma.incident.findFirst({ where: { websiteId, endedAt: null } }),
    ])

    if (!website) return

    // Group ticks by round (one tick per region per round, enforced by the unique key).
    const byRound = new Map<number, Round>()
    for (const t of ticks) {
      const key = t.roundAt.getTime()
      const round = byRound.get(key) ?? { roundAt: t.roundAt, reported: 0, down: [] }
      round.reported += 1
      if (isDown(t.status)) round.down.push(t.region.name)
      byRound.set(key, round)
    }

    // Only judge complete rounds: every region reported, or the grace period has passed.
    const now = Date.now()
    const complete = [...byRound.values()]
      .filter((r) => r.reported >= totalRegions || now - r.roundAt.getTime() > ROUND_GRACE_MS)
      .sort((a, b) => b.roundAt.getTime() - a.roundAt.getTime())

    const [latest, previous] = complete
    if (!latest || !previous) return

    const decision = decide(latest, previous, incident)
    if (decision.action === "none") return

    const baseEmail: Omit<IncidentEmailParams, "startedAt" | "status" | "incidentType" | "downRegions"> = {
      to: website.user.email,
      siteName: website.name,
      siteUrl: website.url,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/monitor/${websiteId}`,
    }

    // OPEN: startedAt is the first bad round, not the moment we became sure.
    if (decision.action === "open") {
      try {
        await prisma.incident.create({
          data: {
            websiteId,
            type: decision.type,
            status: "Ongoing",
            startedAt: previous.roundAt,
            cause: latest.down.join(", "),
          },
        })
      } catch (err: any) {
        if (err.code === "P2002") return // another request opened it first
        throw err
      }

      await prisma.website.update({ where: { id: websiteId }, data: { currentStatus: 500 } })
      await sendAlertEmail({
        ...baseEmail,
        incidentType: decision.type,
        downRegions: latest.down,
        startedAt: previous.roundAt,
        status: "DOWN",
      })
      return
    }

    if (!incident) return

    // UPGRADE Regional -> Global. updateMany + count makes only one request send the email.
    if (decision.action === "upgrade") {
      const res = await prisma.incident.updateMany({
        where: { id: incident.id, type: "Regional", endedAt: null },
        data: { type: "Global", cause: latest.down.join(", ") },
      })
      if (res.count === 1) {
        await sendAlertEmail({
          ...baseEmail,
          incidentType: "Global",
          downRegions: latest.down,
          startedAt: incident.startedAt,
          status: "DOWN",
        })
      }
      return
    }

    // CLOSE: endedAt is the first good round.
    if (decision.action === "close") {
      const res = await prisma.incident.updateMany({
        where: { id: incident.id, endedAt: null },
        data: { endedAt: previous.roundAt, status: "Resolved" },
      })
      if (res.count === 1) {
        await prisma.website.update({ where: { id: websiteId }, data: { currentStatus: 200 } })
        await sendAlertEmail({
          ...baseEmail,
          incidentType: incident.type,
          downRegions: [],
          startedAt: incident.startedAt,
          status: "RESOLVED",
        })
      }
    }
  } catch (err) {
    console.error(`Error checking ${websiteId}:`, err)
  }
}