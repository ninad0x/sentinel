import { prisma } from "@repo/db/client"

export async function POST(req: Request) {

    console.log("env:", process.env.ADMIN_KEY, "header:", req.headers.get("x-admin-key"))


    if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    if (!body.region || typeof body.region !== "string") {
        return Response.json({ error: "region required" }, { status: 400 })
    }

    const region = await prisma.region.upsert({
        where: { name: body.region },
        update: {},
        create: { name: body.region },
    })

    return Response.json({ id: region.id, name: region.name })
}