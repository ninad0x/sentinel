import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("bg-white p-8 flex flex-col", className)}>
    {children}
  </div>
)
 
const FeatureTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-lg font-semibold text-zinc-900 pb-1">{children}</p>
)
 
const FeatureDesc = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-zinc-500 leading-relaxed">{children}</p>
)

export function Features() {
  return (
    <div className="mb-25 max-w-5xl mx-auto rounded-2xl border overflow-hidden shadow-md grid grid-cols-7 gap-px bg-zinc-200">
      <Card className="col-span-4">
        <FeatureTitle>Multi-region monitoring</FeatureTitle>
        <FeatureDesc>3 Global checkpoints. Every 3 minutes</FeatureDesc>


      </Card>



      <Card className="col-span-3">hi</Card>
      <Card className="col-span-3">hi</Card>
      <Card className="col-span-4">hi</Card>
    </div>
  )
}

