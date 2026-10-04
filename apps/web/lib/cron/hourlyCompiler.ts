import { prisma } from "@repo/db/client";

const HOUR_MS = 60 * 60 * 1000;

export async function compileHourlyMetrics(now: Date = new Date()) {
  const windowEnd = new Date(Math.floor(now.getTime() / HOUR_MS) * HOUR_MS);
  const windowStart = new Date(windowEnd.getTime() - HOUR_MS);

  const compiled = await prisma.$executeRaw`
    INSERT INTO "WebsiteMetric" (
      "id", "websiteId", "regionId", "windowStart",
      "checks", "failures", "uptimePercent",
      "avgResponseTimeMs", "minMs", "maxMs", "p50Ms", "p95Ms", "p99Ms"
    )
    SELECT
      gen_random_uuid()::text,
      "websiteId",
      COALESCE("regionId", 'ALL'),
      ${windowStart}::timestamptz,
      COUNT(*)::int,
      SUM(failed)::int,
      (COUNT(*) - SUM(failed))::float8 / COUNT(*) * 100,
      ROUND(AVG(ms))::int,
      MIN(ms),
      MAX(ms),
      percentile_disc(0.50) WITHIN GROUP (ORDER BY ms),
      percentile_disc(0.95) WITHIN GROUP (ORDER BY ms),
      percentile_disc(0.99) WITHIN GROUP (ORDER BY ms)
    FROM (
      SELECT
        "websiteId",
        "regionId",
        ("status" = 0 OR "status" >= 400)::int AS failed,
        CASE WHEN "status" BETWEEN 200 AND 399 THEN "responseTimeMs" END AS ms
      FROM "WebsiteTick"
      WHERE "roundAt" >= ${windowStart}::timestamptz
        AND "roundAt" <  ${windowEnd}::timestamptz
    ) t
    GROUP BY GROUPING SETS (("websiteId", "regionId"), ("websiteId"))
    ON CONFLICT ("websiteId", "regionId", "windowStart") DO UPDATE SET
      "checks"            = EXCLUDED."checks",
      "failures"          = EXCLUDED."failures",
      "uptimePercent"     = EXCLUDED."uptimePercent",
      "avgResponseTimeMs" = EXCLUDED."avgResponseTimeMs",
      "minMs"             = EXCLUDED."minMs",
      "maxMs"             = EXCLUDED."maxMs",
      "p50Ms"             = EXCLUDED."p50Ms",
      "p95Ms"             = EXCLUDED."p95Ms",
      "p99Ms"             = EXCLUDED."p99Ms"
  `;

  return { window: windowStart.toISOString(), compiled };
}