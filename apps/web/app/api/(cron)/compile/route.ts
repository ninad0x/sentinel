import { compileHourlyMetrics } from "@/lib/cron/hourlyCompiler"

export async function GET() {
    console.log("compile called");
    try {
        const result = await compileHourlyMetrics()
        return Response.json(result)
    } catch (error) {
        console.error("Compilation failed:", error)
    return  
    }
}