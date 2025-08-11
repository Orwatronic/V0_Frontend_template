"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Check,
  X,
  Star,
  Users,
  Building,
  Shield,
  Headphones,
  ArrowRight,
  Crown,
  Sparkles,
  Globe,
  Database,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useI18n } from "@/contexts/i18n-context"

const PricingSection = () => {
  const router = useRouter()
  const { t } = useI18n()
  const [billingCycle, setBillingCycle] = useState("monthly")

  const handleStartTrial = (planType: string) => {
    router.push(`/signup?plan=${planType}`)
  }

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === "annual") {
      return Math.round(monthlyPrice * 0.8) // 20% discount for annual
    }
    return monthlyPrice
  }

  const pricingPlans = [
    {
      id: "starter",
      title: t("pricing.starter.title"),
      description: t("pricing.starter.description"),
      icon: Users,
      monthlyPrice: 49,
      popular: false,
      features: [
        { text: t("pricing.starter.features.users"), included: true },
        { text: t("pricing.starter.features.modules"), included: true },
        { text: t("pricing.starter.features.storage"), included: true },
        { text: t("pricing.starter.features.support"), included: true },
        { text: t("pricing.starter.features.multiCurrency"), included: true },
        { text: t("pricing.starter.features.reporting"), included: true },
        { text: t("pricing.features.workflows"), included: false },
        { text: t("pricing.features.multiCompany"), included: false },
        { text: t("pricing.starter.features.apiAccess"), included: false },
      ],
      buttonVariant: "outline" as const,
      buttonText: t("pricing.startTrial"),
      action: () => handleStartTrial("starter"),
    },
    {
      id: "professional",
      title: t("pricing.professional.title"),
      description: t("pricing.professional.description"),
      icon: Building,
      monthlyPrice: 89,
      popular: true,
      features: [
        { text: t("pricing.professional.features.users"), included: true },
        { text: t("pricing.professional.features.modules"), included: true },
        { text: t("pricing.professional.features.storage"), included: true },
        { text: t("pricing.professional.features.support"), included: true },
        { text: t("pricing.features.workflows"), included: true },
        { text: t("pricing.features.multiCompany"), included: true },
        { text: t("pricing.professional.features.reporting"), included: true },
        { text: t("pricing.professional.features.notifications"), included: true },
        { text: t("pricing.professional.features.apiAccess"), included: true },
      ],
      buttonVariant: "default" as const,
      buttonText: t("pricing.startTrial"),
      action: () => handleStartTrial("professional"),
    },
    {
      id: "enterprise",
      title: t("pricing.enterprise.title"),
      description: t("pricing.enterprise.description"),
      icon: Sparkles,
      monthlyPrice: null,
      popular: false,
      features: [
        { text: t("pricing.enterprise.features.users"), included: true },
        { text: t("pricing.enterprise.features.modules"), included: true },
        { text: t("pricing.enterprise.features.storage"), included: true },
        { text: t("pricing.features.dedicated"), included: true },
        { text: t("pricing.features.custom"), included: true },
        { text: t("pricing.features.onPremise"), included: true },
        { text: t("pricing.features.sla"), included: true },
        { text: t("pricing.enterprise.features.whiteLabel"), included: true },
        { text: t("pricing.enterprise.features.accountManager"), included: true },
      ],
      buttonVariant: "outline" as const,
      buttonText: t("pricing.contactSales"),
      action: () => router.push("/contact-sales"),
    },
  ]

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">{t("pricing.badge")}</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("pricing.title").split(" ").slice(0, 2).join(" ")}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("pricing.title").split(" ").slice(2).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("pricing.subtitle")}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-muted rounded-lg p-1 flex items-center">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              {t("pricing.monthly")}
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              {t("pricing.annual")}
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">{t("pricing.save")}</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon
            const isPopular = plan.popular
            const price = plan.monthlyPrice ? getPrice(plan.monthlyPrice) : null

            return (
              <Card
                key={plan.id}
                className={`relative hover:shadow-hover transition-all duration-300 ${
                  isPopular ? "border-primary shadow-enterprise scale-105" : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {t("pricing.mostPopular")}
                    </Badge>
                  </div>
                )}

                <CardHeader className={isPopular ? "pt-8" : ""}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center">
                        {plan.title}
                        {plan.id === "enterprise" && <Crown className="h-5 w-5 ml-2 text-yellow-500" />}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">{plan.description}</p>
                    </div>
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline">
                      {price ? (
                        <>
                          <span className="text-4xl font-bold">${price}</span>
                          <span className="text-muted-foreground ml-2">{t("pricing.perUser")}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">{t("pricing.customPricing")}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {price ? `${t("pricing.billed")} ${billingCycle}` : t("pricing.volumeDiscount")}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${isPopular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}`}
                    onClick={plan.action}
                  >
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enterprise Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-foreground">{t("pricing.enterprise.contact.title")}</h3>
                  <p className="text-muted-foreground">{t("pricing.enterprise.contact.description")}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">{t("pricing.enterprise.features.security")}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">{t("pricing.enterprise.features.deployment")}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">{t("pricing.enterprise.features.integrations")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" onClick={() => router.push("/contact-sales")}>
                  {t("pricing.enterprise.contact.scheduleDemo")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/case-studies")}>
                  {t("pricing.enterprise.contact.viewCaseStudies")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">{t("pricing.trust.description")}</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">{t("pricing.trust.soc2")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">{t("pricing.trust.gdpr")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">{t("pricing.trust.uptime")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
