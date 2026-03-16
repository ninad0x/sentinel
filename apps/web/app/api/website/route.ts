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

    return Response.json({ success: true })
}