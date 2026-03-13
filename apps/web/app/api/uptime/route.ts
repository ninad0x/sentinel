
import { checkIncidentForWebsite } from "@/lib/checkIncident";
import { WebsiteTickBatch } from "@/lib/types";
import { prisma } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = WebsiteTickBatch.safeParse(body);

  if (!parsed.success) {
    console.log(parsed.error);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const region = await prisma.region.findFirst({
      where: { name: data.region },
      select: { id: true, name: true }
    });

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    const ticks = data.results.map(r => ({
      status: r.status,
      responseTimeMs: r.latency ?? -1,
      createdAt: new Date(r.timestamp),
      regionId: region.id,
      websiteId: r.id,
      details: r.details
    }));

    const updateLastCheck = data.results.map(r => ({
      id: r.id,
      lastChecked: new Date(r.timestamp)
    }))

    const batch = await prisma.websiteTick.createMany({ data: ticks });

    await Promise.all(
      updateLastCheck.map(e => 
        prisma.website.update({
          where: { id: e.id },
          data: { lastChecked: e.lastChecked}
        })
      )
    )

    console.log(`inserted: ${batch.count} from ${region.name}`);

    const websiteIds = [...new Set(ticks.map(t => t.websiteId))];

    Promise.all(
      websiteIds.map(id => checkIncidentForWebsite(id)),)
      .catch(err => console.error("Incident check error: ", err))

    return NextResponse.json({ success: true });
    
  } catch (e: any) {
    return NextResponse.json(
      { message: "Error creating ticks", error: e.message },
      { status: 403 }
    );
  }
}