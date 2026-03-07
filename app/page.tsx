import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { DiseaseHotspots } from "@/components/landing/disease-hotspots"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <DiseaseHotspots />
      <DashboardPreview />
      <ProductShowcase />
      <CTA />
      <Footer />
    </main>
  )
}
