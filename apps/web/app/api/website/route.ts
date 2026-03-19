import { auth } from "@repo/auth/server"
import { prisma } from "@repo/db/client"
import { headers } from "next/headers"


export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return Response.json(null, { status: 401 })
    }

    try {
        const count = await prisma.website.count({ where: { userId: session.user.id } })
        if (count >= 2) {
        return Response.json({ error: "Max 2 monitors allowed" }, { status: 403 })
        }
    
        const { name, url } = await req.json()
        const newUrl = url.startsWith("http") ? url : `https://${url}`
    
        await prisma.website.create({
            data: {
                name,
                url: newUrl,
                userId: session.user.id,
                currentStatus: 0
            }
        })
    } catch (error) {
        return Response.json({ error: `Error creating website monitor: ${error}` }, { status: 403 })
    }

    return Response.json({ success: true })
}