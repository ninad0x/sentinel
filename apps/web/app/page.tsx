// app/page.tsx
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import HeroNav from "@/components/heroNav"

export default function Home() {
    return (
    <div className="min-h-screen bg-white">
      <HeroNav />
      <div className="mt-40"></div>
      {/* <Hero /> */}
      <Features />
      {/* <Footer /> */}
    </div>
  )
}