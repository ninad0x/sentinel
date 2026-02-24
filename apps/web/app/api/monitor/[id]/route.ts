import { getMonitorData } from "@/lib/getMonitorData";

export async function GET(req: Request, { params }:
    { params: Promise<{ id: string }>}
) {
    const { id } = await params
    const data = await getMonitorData(id)
    return Response.json(data)
}