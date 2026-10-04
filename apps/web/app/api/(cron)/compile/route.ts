import { compileHourlyMetrics } from "@/lib/cron/hourlyCompiler";

export async function GET(req: Request) {
  if (req.headers.get("x-api-key") !== process.env.INTERNAL_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await compileHourlyMetrics();
    console.log("compile result:", result);
    return Response.json(result);
  } catch (error) {
    console.error("Compilation failed:", error);
    return Response.json({ error: "Compilation failed" }, { status: 500 });
  }
}