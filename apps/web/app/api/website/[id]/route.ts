import { auth } from "@repo/auth/server"
import { prisma } from "@repo/db/client"
import { headers } from "next/headers"


export async function DELETE(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  const { id } = (await params)

  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const website = await prisma.website.findUnique({ where: { id } })

  if (website?.userId !== session.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // if (id === process.env.DEMO_WEBSITE_ID) {
  //   return Response.json({ error: "Cannot delete demo site" }, { status: 403 })
  // }

  return Response.json({ success: true })
}