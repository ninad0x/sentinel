export const handler = async (event: any) => {
  const websites = JSON.parse(event.Records[0].body);

  // const BACKEND_URL = process.env.BACKEND_URL!;
  const BACKEND_URL = process.env.STAGING_URL!;
  
  const results = await Promise.all(
    
    websites.map(async (w: any) => {
      const start = Date.now();
      let status = 0;   // default 0
      let details: string | null = null;

      try {
        const res = await fetch(w.url, { signal: AbortSignal.timeout(5000) });
        status = res.status;
        details = res.statusText || null;
      } catch (e: any) {
        status = 0;
        details = e.message || "Unknown Network Error";
      }

      return {
        id: w.id,
        website: w.url,
        status,
        latency: Date.now() - start,
        timestamp: Date.now(),
        details
      };
    })
  );

  console.log(`Checked ${results.length} sites.`);

    console.log("URL:", BACKEND_URL);
    console.log("KEY:", process.env.INTERNAL_API_KEY);

  await fetch(`${BACKEND_URL}/api/uptime`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": process.env.INTERNAL_API_KEY!
     },
    body: JSON.stringify({
      region: process.env.AWS_REGION,
      results, 
    }),
  });
};