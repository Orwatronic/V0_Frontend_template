"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Database,
  Building,
  Factory,
  Briefcase,
  Shield,
  Wrench,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "landing.solutions.title": "Complete ERP Solutions",
        "landing.solutions.subtitle":
          "Comprehensive modules built with Node.js, PostgreSQL, and Redis - covering every aspect of your enterprise operations with real-time processing and enterprise-grade security.",
        "landing.solutions.implemented": "Fully Implemented",
        "landing.solutions.planned": "Coming Soon",
        "landing.solutions.financial.title": "Financial Management",
        "landing.solutions.financial.description":
          "Complete accounting with General Ledger, Chart of Accounts, multi-currency support, and fiscal period management",
        "landing.solutions.hcm.title": "Human Capital Management",
        "landing.solutions.hcm.description":
          "Employee lifecycle, payroll processing, time tracking, leave management, and organizational structure",
        "landing.solutions.materials.title": "Materials Management",
        "landing.solutions.materials.description":
          "Material master data, inventory control, warehouse management, and procurement processes",
        "landing.solutions.sales.title": "Sales & Distribution",
        "landing.solutions.sales.description":
          "Quotations, order management, pricing, delivery tracking, and customer returns processing",
        "landing.solutions.mdm.title": "Master Data Management",
        "landing.solutions.mdm.description":
          "Centralized reference data for customers, vendors, materials, and organizational hierarchies",
        "landing.solutions.organizational.title": "Organizational Management",
        "landing.solutions.organizational.description":
          "Company structures, cost centers, profit centers, and authorization management",
        "landing.solutions.production.title": "Production Planning",
        "landing.solutions.production.description":
          "Manufacturing execution, BOM management, and production scheduling",
        "landing.solutions.project.title": "Project System",
        "landing.solutions.project.description":
          "Project lifecycle management, resource planning, and milestone tracking",
        "landing.solutions.quality.title": "Quality Management",
        "landing.solutions.quality.description": "Quality control processes, compliance management, and audit trails",
        "landing.solutions.maintenance.title": "Plant Maintenance",
        "landing.solutions.maintenance.description":
          "Asset management, preventive maintenance, and equipment lifecycle tracking",
        "landing.solutions.crm.title": "Customer Relationship Management",
        "landing.solutions.crm.description": "Lead management, customer service, and relationship tracking",
        "common.learnMore": "Learn More",
        "common.comingSoon": "Coming Soon",
      }
      return translations[key] || key
    },
  }
}

const SolutionsGrid = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const implementedSolutions = [
    {
      icon: DollarSign,
      title: t("landing.solutions.financial.title"),
      description: t("landing.solutions.financial.description"),
      route: "/financial",
      features: ["General Ledger", "Multi-Currency", "Journal Entries", "Fiscal Periods"],
    },
    {
      icon: Users,
      title: t("landing.solutions.hcm.title"),
      description: t("landing.solutions.hcm.description"),
      route: "/employees",
      features: ["Employee Management", "Payroll", "Time Tracking", "Leave Management"],
    },
    {
      icon: Package,
      title: t("landing.solutions.materials.title"),
      description: t("landing.solutions.materials.description"),
      route: "/materials",
      features: ["Material Master", "Inventory Control", "Warehouse Mgmt", "Procurement"],
    },
    {
      icon: ShoppingCart,
      title: t("landing.solutions.sales.title"),
      description: t("landing.solutions.sales.description"),
      route: "/sales",
      features: ["Order Management", "Pricing", "Delivery Tracking", "Returns"],
    },
    {
      icon: Database,
      title: t("landing.solutions.mdm.title"),
      description: t("landing.solutions.mdm.description"),
      route: "/mdm",
      features: ["Customer Master", "Vendor Master", "Material Groups", "Hierarchies"],
    },
    {
      icon: Building,
      title: t("landing.solutions.organizational.title"),
      description: t("landing.solutions.organizational.description"),
      route: "/organizational",
      features: ["Company Structure", "Cost Centers", "Profit Centers", "Authorization"],
    },
  ]

  const plannedSolutions = [
    {
      icon: Factory,
      title: t("landing.solutions.production.title"),
      description: t("landing.solutions.production.description"),
      features: ["Manufacturing", "BOM Management", "Production Scheduling", "Work Orders"],
    },
    {
      icon: Briefcase,
      title: t("landing.solutions.project.title"),
      description: t("landing.solutions.project.description"),
      features: ["Project Planning", "Resource Management", "Milestone Tracking", "Budgeting"],
    },
    {
      icon: Shield,
      title: t("landing.solutions.quality.title"),
      description: t("landing.solutions.quality.description"),
      features: ["Quality Control", "Compliance", "Audit Trails", "Certifications"],
    },
    {
      icon: Wrench,
      title: t("landing.solutions.maintenance.title"),
      description: t("landing.solutions.maintenance.description"),
      features: ["Asset Management", "Preventive Maintenance", "Work Orders", "Equipment"],
    },
    {
      icon: UserCheck,
      title: t("landing.solutions.crm.title"),
      description: t("landing.solutions.crm.description"),
      features: ["Lead Management", "Customer Service", "Sales Pipeline", "Analytics"],
    },
  ]

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">Enterprise Solutions</Badge>
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
              <CheckCircle className="w-4 h-4 mr-2" />
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
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
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
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                      onClick={() => router.push(solution.route)}
                    >
                      {t("common.learnMore")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Planned Solutions */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {t("landing.solutions.planned")}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plannedSolutions.map((solution, index) => {
              const IconComponent = solution.icon
              return (
                <Card
                  key={index}
                  className="p-6 h-full transition-all duration-300 border-border/30 bg-card/30 backdrop-blur-sm opacity-75"
                >
                  <CardHeader className="p-0 mb-4">
                    <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-muted-foreground" />
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
                          <Clock className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="ghost" className="w-full cursor-not-allowed opacity-50" disabled>
                      {t("common.comingSoon")}
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
