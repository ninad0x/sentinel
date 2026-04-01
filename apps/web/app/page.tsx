import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Header } from "@/components/heroNav"
import LogoStack from "@/components/logoStack"

export default function Home() {
    return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      {/* <div className="mt-20"></div> */}
      <LogoStack />
      <Features />
      {/* <FlowDiagram /> */}
      <Footer />
    </div>
  )
} 