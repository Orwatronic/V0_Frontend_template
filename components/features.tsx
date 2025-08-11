"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield, Zap, Globe, Users, Database, TrendingUp, Cloud, Lock } from 'lucide-react'
import { useI18n } from "@/contexts/i18n-context"

const Features = () => {
  const { t } = useI18n()

  const features = [
    {
      icon: Globe,
      title: t("landing.features.global.title"),
      description: t("landing.features.global.description"),
    },
    {
      icon: Zap,
      title: t("landing.features.performance.title"),
      description: t("landing.features.performance.description"),
    },
    {
      icon: Shield,
      title: t("landing.features.security.title"),
      description: t("landing.features.security.description"),
    },
    {
      icon: Database,
      title: t("landing.features.data.title"),
      description: t("landing.features.data.description"),
    },
    {
      icon: Users,
      title: t("landing.features.collaboration.title"),
      description: t("landing.features.collaboration.description"),
    },
    {
      icon: BarChart3,
      title: t("landing.features.analytics.title"),
      description: t("landing.features.analytics.description"),
    },
    {
      icon: TrendingUp,
      title: t("landing.features.intelligence.title"),
      description: t("landing.features.intelligence.description"),
    },
    {
      icon: Cloud,
      title: t("landing.features.cloud.title"),
      description: t("landing.features.cloud.description"),
    },
    {
      icon: Lock,
      title: t("landing.features.compliance.title"),
      description: t("landing.features.compliance.description"),
    },
  ]

  return (
    <section className="relative py-24 bg-feature-gradient overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20"
            aria-label={t("landing.features.sectionBadge")}
          >
            {t("landing.features.sectionBadge")}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("landing.features.title")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            {t("landing.features.subtitle")}
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
                  <div
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                    aria-hidden="true"
                  >
                    <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />
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
