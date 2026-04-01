import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Header } from "@/components/heroNav"
import LogoStack from "@/components/logoStack"
import Warmup from "@/components/warmup"

export default function Home() {
    return (
    <div className="min-h-screen bg-white">
      <Warmup />
      <Header />
      <Hero />
      <LogoStack />
      <Features />
      {/* <FlowDiagram /> */}
      <Footer />
    </div>
  )
} 