"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield, Zap, Globe, Users, Database, TrendingUp, Cloud, Lock } from "lucide-react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "landing.features.global.title": "Multi-Currency Support",
        "landing.features.performance.title": "Real-time Processing",
        "landing.features.security.title": "Advanced Security",
        "landing.features.data.title": "Hierarchical Data",
        "landing.features.collaboration.title": "Workflow Engine",
        "landing.features.analytics.title": "Batch & Serial Tracking",
        "landing.features.intelligence.title": "Three-way Matching",
        "landing.features.cloud.title": "Fiscal Management",
        "landing.features.compliance.title": "API-First Design",
      }
      return translations[key] || key
    },
  }
}

const Features = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: Globe,
      title: t("landing.features.global.title"),
      description: "Full international business support with real-time exchange rates and multi-company operations",
    },
    {
      icon: Zap,
      title: t("landing.features.performance.title"),
      description: "Socket.IO for live updates, Redis caching, and sub-second response times with 99.9% uptime",
    },
    {
      icon: Shield,
      title: t("landing.features.security.title"),
      description: "JWT authentication, RBAC authorization, comprehensive audit trails, and enterprise-grade security",
    },
    {
      icon: Database,
      title: t("landing.features.data.title"),
      description: "Chart of Accounts, organizational structures, and material groups with materialized path queries",
    },
    {
      icon: Users,
      title: t("landing.features.collaboration.title"),
      description: "Automated approval processes, status tracking, and streamlined business workflows",
    },
    {
      icon: BarChart3,
      title: t("landing.features.analytics.title"),
      description: "Complete material traceability, inventory management, and batch/serial number tracking",
    },
    {
      icon: TrendingUp,
      title: t("landing.features.intelligence.title"),
      description: "Automated Purchase Order, Goods Receipt, and Invoice verification with intelligent matching",
    },
    {
      icon: Cloud,
      title: t("landing.features.cloud.title"),
      description: "Period closing, financial reporting, journal entries, and comprehensive accounting controls",
    },
    {
      icon: Lock,
      title: t("landing.features.compliance.title"),
      description: "RESTful APIs, OpenAPI documentation, and seamless integration capabilities",
    },
  ]

  return (
    <section className="relative py-24 bg-feature-gradient overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">Enterprise Features</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Built with Node.js, PostgreSQL, and Redis - our cloud-native ERP system delivers enterprise-grade
            functionality with modern architecture and real-time processing capabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="p-8 h-full hover:shadow-hover transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2 text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
