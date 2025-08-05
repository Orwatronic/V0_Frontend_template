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

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "pricing.title": "Choose Your Growth Plan",
        "pricing.subtitle":
          "Transparent, value-based pricing for businesses of all sizes. Start your digital transformation with our cloud-native ERP system.",
        "pricing.monthly": "Monthly",
        "pricing.annual": "Annual",
        "pricing.save": "Save 20%",
        "pricing.mostPopular": "Most Popular",
        "pricing.customPricing": "Custom Pricing",
        "pricing.startTrial": "Start Free Trial",
        "pricing.contactSales": "Contact Sales",
        "pricing.perUser": "/user/month",
        "pricing.billed": "Billed",
        "pricing.starter.title": "Starter",
        "pricing.starter.description": "Perfect for small teams getting started",
        "pricing.professional.title": "Professional",
        "pricing.professional.description": "Ideal for growing businesses",
        "pricing.enterprise.title": "Enterprise",
        "pricing.enterprise.description": "Complete solution for large organizations",
        "pricing.features.users": "users",
        "pricing.features.storage": "storage per user",
        "pricing.features.support": "support",
        "pricing.features.modules": "ERP modules",
        "pricing.features.workflows": "Advanced workflows & automation",
        "pricing.features.multiCompany": "Multi-company support",
        "pricing.features.unlimited": "Unlimited",
        "pricing.features.custom": "Custom integrations & API access",
        "pricing.features.onPremise": "On-premise deployment option",
        "pricing.features.sla": "SLA guarantee & compliance",
        "pricing.features.dedicated": "24/7 dedicated support",
        "pricing.volumeDiscount": "Volume discounts available",
      }
      return translations[key] || key
    },
  }
}

const PricingSection = () => {
  const router = useRouter()
  const { t } = useTranslation()
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
        { text: `Up to 25 ${t("pricing.features.users")}`, included: true },
        { text: `Core ERP modules (FIN, HCM, MM)`, included: true },
        { text: `5GB ${t("pricing.features.storage")}`, included: true },
        { text: `Email ${t("pricing.features.support")}`, included: true },
        { text: `Multi-currency support`, included: true },
        { text: `Basic reporting`, included: true },
        { text: t("pricing.features.workflows"), included: false },
        { text: t("pricing.features.multiCompany"), included: false },
        { text: `API access`, included: false },
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
        { text: `Up to 100 ${t("pricing.features.users")}`, included: true },
        { text: `All ERP modules + Sales & MDM`, included: true },
        { text: `25GB ${t("pricing.features.storage")}`, included: true },
        { text: `Priority support + Phone`, included: true },
        { text: t("pricing.features.workflows"), included: true },
        { text: t("pricing.features.multiCompany"), included: true },
        { text: `Advanced reporting & analytics`, included: true },
        { text: `Real-time notifications`, included: true },
        { text: `API access (limited)`, included: true },
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
        { text: `${t("pricing.features.unlimited")} ${t("pricing.features.users")}`, included: true },
        { text: `Complete ERP suite + Custom modules`, included: true },
        { text: `${t("pricing.features.unlimited")} storage`, included: true },
        { text: t("pricing.features.dedicated"), included: true },
        { text: t("pricing.features.custom"), included: true },
        { text: t("pricing.features.onPremise"), included: true },
        { text: t("pricing.features.sla"), included: true },
        { text: `White-label options`, included: true },
        { text: `Dedicated account manager`, included: true },
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
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">Enterprise Pricing</Badge>
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
                  <h3 className="text-xl font-bold text-foreground">Need a Custom Solution?</h3>
                  <p className="text-muted-foreground">
                    Our enterprise team can create a tailored ERP solution for your specific needs.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Global Deployment</span>
                </div>
                <div className="flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Custom Integrations</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" onClick={() => router.push("/contact-sales")}>
                  Schedule a Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/case-studies")}>
                  View Case Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by 10,000+ businesses worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
