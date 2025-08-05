import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight, Shield, Users, Headphones } from "lucide-react"
import Image from "next/image"

export default function Component() {
  return (
    <section className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Main Hero Content */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  🚀 Trusted by Fortune 500 Companies
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Transform Your Enterprise with <span className="text-blue-200">Feebee Technologies</span> ERP
                </h1>

                <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                  Streamline operations, boost productivity, and drive growth with our comprehensive ERP system. Built
                  for modern enterprises who demand excellence, scalability, and innovation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-blue-200 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Mockup */}
            <div className="relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-3xl scale-105"></div>
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl scale-110"></div>

                {/* Dashboard Image */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Image
                    src="/modern-erp-dashboard.png"
                    alt="EnterpriseERP Dashboard"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Live Data
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Real-time Analytics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Shield className="h-6 w-6 text-green-400" />
                <span className="text-3xl font-bold">99.9%</span>
              </div>
              <p className="text-blue-200 font-medium">Uptime SLA</p>
              <p className="text-blue-300 text-sm">Guaranteed reliability</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold">10K+</span>
              </div>
              <p className="text-blue-200 font-medium">Enterprise Clients</p>
              <p className="text-blue-300 text-sm">Trusted worldwide</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white">
                <Headphones className="h-6 w-6 text-purple-400" />
                <span className="text-3xl font-bold">24/7</span>
              </div>
              <p className="text-blue-200 font-medium">Expert Support</p>
              <p className="text-blue-300 text-sm">Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
