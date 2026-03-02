import { prisma } from "@repo/db/client"

export async function GET() {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        // for testing
        // const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000)

        const result = await prisma.websiteTick.deleteMany({
            where: { createdAt: { lt: sevenDaysAgo } }
        })

        console.log(`Deleted ${result.count} ticks older than 7 days`)
        return Response.json({ deleted: result.count })
    } catch (error) {
        console.error("Cleanup failed:", error)
        return Response.json({ error: "Cleanup failed" }, { status: 500 })
    }
}