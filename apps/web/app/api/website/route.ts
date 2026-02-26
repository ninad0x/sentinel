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

    const body = await req.json()

    const website = await prisma.website.create({
        data: {
            name: body.name,
            url: body.url,
            userId: session.user.id,
            currentStatus: 0
        }
    })

    return Response.json(website)
}