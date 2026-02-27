import { prisma } from "@repo/db/client"

export async function GET(req: Request) {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== process.env.INTERNAL_API_KEY) {
        return new Response("Unauthorized", { status: 401 });
    }

    const websites = await prisma.website.findMany({
        where: { enabled: true }
    })

    return Response.json({ websites })
}
