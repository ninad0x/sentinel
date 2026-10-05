const BACKEND_URL = process.env.BACKEND_URL!;

export const handler = async (event: any) => {
  // CDK: SqsEventSource with batchSize: 1, so there is exactly one record.
  const { roundAt, sites } = JSON.parse(event.Records[0].body);

  const results = await Promise.all(
    sites.map(async (w: { id: string; url: string }) => {
      const start = Date.now();
      let status = 0;
      let latency: number | null = null;
      let details: string | null = null;

      try {
        const res = await fetch(w.url, { signal: AbortSignal.timeout(5000) });
        latency = Date.now() - start; // time until response headers arrived
        status = res.status;
        details = res.statusText || null;
        await res.body?.cancel().catch(() => {})
      } catch (e: any) {
        status = 0
        latency = null
        details = e.name === "TimeoutError" ? "timeout" : e.cause?.code ?? e.message ?? "network error";
      }

      return {
        id: w.id,
        status,
        latency,
        timestamp: start,
        details,
      };
    })
  );

  console.log(`Round ${roundAt}: checked ${results.length} sites.`);

  const res = await fetch(`${BACKEND_URL}/api/uptime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INTERNAL_API_KEY!,
    },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      roundAt,
      results,
    }),
    signal: AbortSignal.timeout(10000),
  });

  // Throwing makes SQS retry the message instead of silently losing the round.
  if (!res.ok) throw new Error(`Uptime POST failed: ${res.status}`);
};