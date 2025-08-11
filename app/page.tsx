import Navigation from "../components/navigation"
import HeroSection from "../components/hero-section"
import Features from "../components/features"
import SolutionsGrid from "../components/solutions-grid"
import Footer from "../components/footer"

export default function Page() {
  return (
    <div className="bg-[#f8fafc]">
      <Navigation />
      <HeroSection />
      <Features />
      <SolutionsGrid />
      <Footer />
    </div>
  )
}
