"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Check, Users, Globe, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Mock translation function since we don't have react-i18next in the preview
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "landing.hero.badge": "Enterprise-Ready ERP Solution",
        "landing.hero.title": "Transform Your Enterprise with Feebee Technologies ERP",
        "landing.hero.subtitle":
          "Comprehensive enterprise resource planning system designed to manage core business processes across all departments with integrated modules for complete operational control.",
        "landing.hero.cta.primary": "Start Free Trial",
        "landing.hero.cta.secondary": "Watch Demo",
        "landing.hero.badge.realtime": "Real-time Data",
        "landing.hero.badge.analytics": "Advanced Analytics",
        "landing.hero.image.alt": "EnterpriseERP Dashboard",
        "landing.hero.stats.uptime": "Uptime SLA",
        "landing.hero.stats.clients": "Enterprise Clients",
        "landing.hero.stats.support": "Expert Support",
        "common.secure": "SOC 2 Certified",
        "common.compliant": "GDPR Compliant",
      }
      return translations[key] || key
    },
  }
}

const HeroSection = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden bg-hero-gradient">
      {/* SVG Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 mt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              {t("landing.hero.badge")}
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                {t("landing.hero.title")}
              </h1>

              <p className="text-lg leading-relaxed text-foreground/80 max-w-2xl">{t("landing.hero.subtitle")}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => router.push("/login")}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                {t("landing.hero.cta.primary")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("#demo")}
                className="h-14 px-8 text-lg font-semibold border-2"
              >
                <Play className="mr-2 h-5 w-5" />
                {t("landing.hero.cta.secondary")}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>{t("common.secure")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t("common.compliant")}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Image */}
          <div className="relative animate-slide-up">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl scale-105"></div>

            {/* Dashboard Image */}
            <Card className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <Image
                  src="/enterprise-dashboard.png"
                  alt={t("landing.hero.image.alt")}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                />
              </CardContent>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {t("landing.hero.badge.realtime")}
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {t("landing.hero.badge.analytics")}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold">99.9%</span>
              </div>
              <p className="text-foreground/80 font-medium">{t("landing.hero.stats.uptime")}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold">10K+</span>
              </div>
              <p className="text-foreground/80 font-medium">{t("landing.hero.stats.clients")}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Globe className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold">24/7</span>
              </div>
              <p className="text-foreground/80 font-medium">{t("landing.hero.stats.support")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
