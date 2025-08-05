import Navigation from "../components/navigation"
import HeroSection from "../components/hero-section"
import Features from "../components/features"
import SolutionsGrid from "../components/solutions-grid"

export default function Page() {
  return (
    <main className="bg-[#f8fafc]">
      <Navigation />
      <HeroSection />
      <Features />
      <SolutionsGrid />
    </main>
  )
}
