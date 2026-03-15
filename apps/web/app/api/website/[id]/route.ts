import { prisma } from "@repo/db/client"


export async function DELETE(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params
  console.log("ID is ", id);
  await prisma.website.delete({
    where: { id: id }
  })

  return Response.json({ success: true })
}