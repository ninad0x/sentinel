import { getDashboardData } from "@/lib/getDashboardData"
import { auth } from "@repo/auth/server"
import { headers } from "next/headers"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return Response.json(null, { status: 401 })
  
  const data = await getDashboardData(session.user.id)
  return Response.json(data)
}