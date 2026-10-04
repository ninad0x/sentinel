import { checkIncidentForWebsite } from "@/lib/checkIncident";
import { WebsiteTickBatch } from "@/lib/types";
import { prisma } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.headers.get("x-api-key") !== process.env.INTERNAL_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parsed = WebsiteTickBatch.safeParse(await req.json());
  if (!parsed.success) {
    console.log(parsed.error);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { region: regionName, roundAt, results } = parsed.data;

  try {
    const region = await prisma.region.findUnique({
      where: { name: regionName },
      select: { id: true, name: true },
    });

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    // Skip sites deleted since the scheduler fetched the list,
    // otherwise one missing site would fail the whole batch (foreign key).
    const existing = await prisma.website.findMany({
      where: { id: { in: results.map((r) => r.id) } },
      select: { id: true },
    });
    const validIds = new Set(existing.map((w: { id: string}) => w.id));
    const valid = results.filter((r) => validIds.has(r.id));

    const round = new Date(roundAt);

    const ticks = valid.map((r) => ({
      roundAt: round,
      createdAt: new Date(r.timestamp),
      status: r.status,
      responseTimeMs: r.latency,
      regionId: region.id,
      websiteId: r.id,
      details: r.details ?? null,
    }));

    const batch = await prisma.websiteTick.createMany({
      data: ticks,
      skipDuplicates: true,
    });

    await Promise.all(
      ticks.map((t) =>
        prisma.website.updateMany({
          where: {
            id: t.websiteId,
            OR: [{ lastChecked: null }, { lastChecked: { lt: t.createdAt } }],
          },
          data: { lastChecked: t.createdAt },
        })
      )
    );

    console.log(`round ${roundAt}: inserted ${batch.count}/${ticks.length} from ${region.name}`);

    const websiteIds = [...new Set(ticks.map((t) => t.websiteId))];
    await Promise.allSettled(websiteIds.map((id) => checkIncidentForWebsite(id)));

    return NextResponse.json({ success: true, inserted: batch.count });
  } catch (e: any) {
    console.error("uptime route error:", e);
    return NextResponse.json(
      { message: "Error creating ticks", error: e.message },
      { status: 500 }
    );
  }
}