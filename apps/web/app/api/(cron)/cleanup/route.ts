import { prisma } from "@repo/db/client";

export async function GET() {
  try {
    const now = Date.now();
    const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
    const thirtyFiveDaysAgo = new Date(now - 35 * 24 * 60 * 60 * 1000);

    const [ticks, metrics] = await Promise.all([
      prisma.websiteTick.deleteMany({
        where: { createdAt: { lt: twoDaysAgo } },
      }),
      prisma.websiteMetric.deleteMany({
        where: { windowStart: { lt: thirtyFiveDaysAgo } },
      }),
    ]);

    console.log(
      `Cleanup complete: deleted ${ticks.count} ticks older than 2 days and ${metrics.count} metrics older than 35 days.`
    );

    return Response.json({
      success: true,
      deletedTicks: ticks.count,
      deletedMetrics: metrics.count,
    });
  } catch (error) {
    console.error("Cleanup failed:", error);
    return Response.json({ error: "Cleanup failed" }, { status: 500 });
  }
}