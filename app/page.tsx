import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ValueProps } from "@/components/value-props"
import { LiveTracking } from "@/components/live-tracking"
import { NutritionIntelligence } from "@/components/nutrition-intelligence"
import { Reviews } from "@/components/reviews"
import { PlatformFeatures } from "@/components/platform-features"
import { BusinessDashboard } from "@/components/business-dashboard"
import { CommentsSection } from "@/components/comments-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <ValueProps />
      <LiveTracking />
      <NutritionIntelligence />
      <Reviews />
      <CommentsSection />
      <PlatformFeatures />
      <BusinessDashboard />
      <FinalCTA />
      <Footer />
    </main>
  )
}
