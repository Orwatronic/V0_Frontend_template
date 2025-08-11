"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, Package, ShoppingCart, Database, Building, Factory, Briefcase, Shield, Wrench, UserCheck, ArrowRight, CheckCircle, Clock, Brain, Sparkles, Zap } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { resolveDestination } from "@/lib/modules"
import { useI18n } from "@/contexts/i18n-context"

function featureList(t: (k: string) => string, prefix: string) {
  return [t(`${prefix}.features.f1`), t(`${prefix}.features.f2`), t(`${prefix}.features.f3`), t(`${prefix}.features.f4`)]
}

const SolutionsGrid = () => {
  const { t } = useI18n()
  const router = useRouter()
  const { token } = useAuth()

  const implementedSolutions = [
    {
      icon: DollarSign,
      title: t("landing.solutions.financial.title"),
      description: t("landing.solutions.financial.description"),
      route: "/financial",
      features: featureList(t, "landing.solutions.financial"),
    },
    {
      icon: Users,
      title: t("landing.solutions.hcm.title"),
      description: t("landing.solutions.hcm.description"),
      route: "/employees",
      features: featureList(t, "landing.solutions.hcm"),
    },
    {
      icon: Package,
      title: t("landing.solutions.materials.title"),
      description: t("landing.solutions.materials.description"),
      route: "/materials",
      features: featureList(t, "landing.solutions.materials"),
    },
    {
      icon: ShoppingCart,
      title: t("landing.solutions.sales.title"),
      description: t("landing.solutions.sales.description"),
      route: "/sales",
      features: featureList(t, "landing.solutions.sales"),
    },
    {
      icon: Database,
      title: t("landing.solutions.mdm.title"),
      description: t("landing.solutions.mdm.description"),
      route: "/mdm",
      features: featureList(t, "landing.solutions.mdm"),
    },
    {
      icon: Building,
      title: t("landing.solutions.organizational.title"),
      description: t("landing.solutions.organizational.description"),
      route: "/organizational",
      features: featureList(t, "landing.solutions.organizational"),
    },
  ]

  const recentlyCompletedSolutions = [
    {
      icon: Factory,
      title: t("landing.solutions.production.title"),
      description: t("landing.solutions.production.description"),
      route: "/production",
      features: featureList(t, "landing.solutions.production"),
    },
    {
      icon: Briefcase,
      title: t("landing.solutions.project.title"),
      description: t("landing.solutions.project.description"),
      route: "/project",
      features: featureList(t, "landing.solutions.project"),
    },
    {
      icon: Shield,
      title: t("landing.solutions.quality.title"),
      description: t("landing.solutions.quality.description"),
      route: "/quality",
      features: featureList(t, "landing.solutions.quality"),
    },
    {
      icon: Wrench,
      title: t("landing.solutions.maintenance.title"),
      description: t("landing.solutions.maintenance.description"),
      route: "/maintenance",
      features: featureList(t, "landing.solutions.maintenance"),
    },
    {
      icon: UserCheck,
      title: t("landing.solutions.crm.title"),
      description: t("landing.solutions.crm.description"),
      route: "/crm",
      features: featureList(t, "landing.solutions.crm"),
    },
  ]

  const aiPoweredSolutions = [
    {
      icon: Factory,
      title: t("landing.solutions.productionAI.title"),
      description: t("landing.solutions.productionAI.description"),
      route: "/production-ai",
      features: featureList(t, "landing.solutions.productionAI"),
    },
    {
      icon: Briefcase,
      title: t("landing.solutions.projectAI.title"),
      description: t("landing.solutions.projectAI.description"),
      route: "/project-ai",
      features: featureList(t, "landing.solutions.projectAI"),
    },
    {
      icon: Shield,
      title: t("landing.solutions.qualityAI.title"),
      description: t("landing.solutions.qualityAI.description"),
      route: "/quality-ai",
      features: featureList(t, "landing.solutions.qualityAI"),
    },
    {
      icon: Wrench,
      title: t("landing.solutions.maintenanceAI.title"),
      description: t("landing.solutions.maintenanceAI.description"),
      route: "/maintenance-ai",
      features: featureList(t, "landing.solutions.maintenanceAI"),
    },
    {
      icon: UserCheck,
      title: t("landing.solutions.crmAI.title"),
      description: t("landing.solutions.crmAI.description"),
      route: "/crm-ai",
      features: featureList(t, "landing.solutions.crmAI"),
    },
  ]

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            {t("landing.solutions.sectionBadge")}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("landing.solutions.title")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-4xl mx-auto">
            {t("landing.solutions.subtitle")}
          </p>
        </div>

        {/* Implemented Solutions */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("landing.solutions.implemented")}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {implementedSolutions.map((solution, index) => {
              const IconComponent = solution.icon
              return (
                <Card
                  key={index}
                  className="p-6 h-full hover:shadow-hover transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="p-0 mb-4">
                    <div
                      className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                      aria-hidden="true"
                    >
                      <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2 text-foreground">{solution.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground mb-4">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="space-y-3 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                      onClick={() => router.push(resolveDestination(solution.route, Boolean(token)))}
                    >
                      {t("common.learnMore")}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recently Completed Solutions */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("landing.solutions.recentlyCompleted")}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentlyCompletedSolutions.map((solution, index) => {
              const IconComponent = solution.icon
              return (
                <Card
                  key={index}
                  className="p-6 h-full hover:shadow-hover transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="p-0 mb-4">
                    <div
                      className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors"
                      aria-hidden="true"
                    >
                      <IconComponent className="w-6 h-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2 text-foreground">{solution.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground mb-4">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="space-y-3 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" aria-hidden="true" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors bg-transparent"
                      onClick={() => router.push(resolveDestination(solution.route, Boolean(token)))}
                    >
                      {t("common.learnMore")}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* AI-Powered Solutions */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200 px-4 py-2"
            >
              <Brain className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("landing.solutions.aiPowered")}
              <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiPoweredSolutions.map((solution, index) => {
              const IconComponent = solution.icon
              return (
                <Card
                  key={index}
                  className="p-6 h-full transition-all duration-300 border-border/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-sm relative overflow-hidden"
                >
                  {/* AI Glow Effect */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"
                    aria-hidden="true"
                  ></div>

                  <CardHeader className="p-0 mb-4 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <IconComponent className="w-6 h-6 text-purple-600" aria-hidden="true" />
                      </div>
                      <div className="flex items-center space-x-1" aria-hidden="true">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600">{"AI-Powered"}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2 text-foreground">{solution.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground mb-4">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 relative z-10">
                    <div className="space-y-3 mb-4">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" aria-hidden="true" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="ghost" className="w-full cursor-not-allowed opacity-50" disabled>
                      {t("common.comingSoon")}
                      <Clock className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionsGrid
