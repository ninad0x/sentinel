import { getDashboardData } from "@/lib/getDashboardData";
import { auth } from "@repo/auth/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import WebsiteCard from "./_components/websiteCard";
import { CardData } from "@/lib/types";

export default async function Dashboard() {
  
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const data = await getDashboardData(session.user.id)
 
  return (
    <div className="bg-gray-50/50 h-screen">
      <div className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border">
        
        {/* Header */}
        <nav className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <p className="font-semibold text-lg text-gray-900 tracking-tight">Dashboard</p>
          <div className="flex gap-6 text-sm font-mono text-gray-400">
            <Link href="#" className="hover:text-gray-900 transition">Dashboard</Link>
            <Link href="#" className="hover:text-gray-900 transition">Settings</Link>
          </div>
        </nav>

          <div className="">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200">
            Your Websites
          </p>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-b">
            {data.map((site: CardData) => <WebsiteCard key={site.id} site={site}/>)}
          </div>
        </div>
      </div>
    </div>
  )
}