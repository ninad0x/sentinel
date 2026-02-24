import DashboardClient from "./_components/dashboardClient";
import { auth } from "@repo/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/sign-in")

  return <DashboardClient />
}