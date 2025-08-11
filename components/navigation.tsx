"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Menu, ChevronDown, DollarSign, Users, Package, ShoppingCart, Database, Building, Factory, Briefcase, Shield, Wrench, UserCheck, Zap, BarChart3, Globe, Workflow, Brain, Sparkles, CheckCircle, Clock, ArrowRight, FileText, BookOpen, Newspaper, Video, Headphones, Handshake, Mail } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import { resolveDestination } from "@/lib/modules"
import { useI18n } from "@/contexts/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()
  const router = useRouter()
  const { token } = useAuth()
  const getHref = (appPath: string) => resolveDestination(appPath, Boolean(token))

  const implementedSolutions = [
    { icon: DollarSign, title: t("nav.solutionsItems.financial"), href: "/financial" },
    { icon: Users, title: t("nav.solutionsItems.hcm"), href: "/employees" },
    { icon: Package, title: t("nav.solutionsItems.materials"), href: "/materials" },
    { icon: ShoppingCart, title: t("nav.solutionsItems.sales"), href: "/sales" },
    { icon: Database, title: t("nav.solutionsItems.mdm"), href: "/mdm" },
    { icon: Building, title: t("nav.solutionsItems.organizational"), href: "/organizational" },
  ]

  const recentSolutions = [
    { icon: Factory, title: t("nav.solutionsItems.production"), href: "/production", isNew: true },
    { icon: Briefcase, title: t("nav.solutionsItems.project"), href: "/project", isNew: true },
    { icon: Shield, title: t("nav.solutionsItems.quality"), href: "/quality", isNew: true },
    { icon: Wrench, title: t("nav.solutionsItems.maintenance"), href: "/maintenance", isNew: true },
    { icon: UserCheck, title: t("nav.solutionsItems.crm"), href: "/crm", isNew: true },
  ]

  const features = [
    { icon: Zap, title: t("nav.featureItems.realtime"), description: "Process transactions in real-time" },
    { icon: Globe, title: t("nav.featureItems.multicurrency"), description: "150+ currencies with live rates" },
    { icon: Workflow, title: t("nav.featureItems.workflow"), description: "Configurable approval workflows" },
    { icon: BarChart3, title: t("nav.featureItems.analytics"), description: "Advanced reporting & KPIs" },
    { icon: Database, title: t("nav.featureItems.integration"), description: "REST APIs and webhooks" },
    { icon: Shield, title: t("nav.featureItems.security"), description: "Enterprise security & compliance" },
  ]

  const resources = [
    { title: t("nav.resourceItems.documentation"), href: "/docs", icon: FileText, description: "Guides and references" },
    { title: t("nav.resourceItems.apiDocs"), href: "/api-docs", icon: Database, description: "API docs & examples" },
    { title: t("nav.resourceItems.tutorials"), href: "/tutorials", icon: BookOpen, description: "Step-by-step tutorials" },
    { title: t("nav.resourceItems.blog"), href: "/blog", icon: Newspaper, description: "Insights & best practices" },
    { title: t("nav.resourceItems.webinars"), href: "/webinars", icon: Video, description: "Live demos & talks" },
    { title: t("nav.resourceItems.support"), href: "/support", icon: Headphones, description: "24/7 technical support" },
  ]

  const company = [
    { title: t("nav.companyItems.about"), href: "/about", icon: Building, description: "About the company" },
    { title: t("nav.companyItems.careers"), href: "/careers", icon: Users, description: "Join our team" },
    { title: t("nav.companyItems.partners"), href: "/partners", icon: Handshake, description: "Our partners" },
    { title: t("nav.companyItems.news"), href: "/news", icon: Newspaper, description: "Company news" },
    { title: t("nav.companyItems.contact"), href: "/contact", icon: Mail, description: "Contact us" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/enterprise-systems-logo.png" alt="Feebee ERP Logo" width={32} height={32} />
            <span className="text-xl font-bold text-foreground">Feebee ERP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>{t("nav.solutions")}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[800px] p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Implemented Solutions */}
                  <div>
                    <DropdownMenuLabel className="flex items-center text-sm font-semibold text-green-700 mb-3">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("nav.solutionsSection.implemented")}
                    </DropdownMenuLabel>
                    <div className="space-y-2">
                      {implementedSolutions.map((solution, index) => {
                        const IconComponent = solution.icon
                        return (
                          <DropdownMenuItem key={index} asChild>
                            <Link
                              href={getHref(solution.href)}
                              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                            >
                              <IconComponent className="h-4 w-4 text-primary" />
                              <span className="text-sm">{solution.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recently Completed */}
                  <div>
                    <DropdownMenuLabel className="flex items-center text-sm font-semibold text-blue-700 mb-3">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("nav.solutionsSection.recent")}
                    </DropdownMenuLabel>
                    <div className="space-y-2">
                      {recentSolutions.map((solution, index) => {
                        const IconComponent = solution.icon
                        return (
                          <DropdownMenuItem key={index} asChild>
                            <Link
                              href={getHref(solution.href)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                <IconComponent className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{solution.title}</span>
                              </div>
                              {solution.isNew && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  {t("common.new")}
                                </Badge>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </div>

                  {/* AI Solutions Teaser */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-700">{t("nav.solutionsSection.ai")}</span>
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-purple-600 mb-3">{t("nav.solutionsItems.aiTeaser")}</p>
                    <div className="flex items-center space-x-2 text-xs text-purple-500">
                      <Clock className="h-3 w-3" />
                      <span>{t("common.comingSoon")}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>{t("nav.features")}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-6">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted">
                        <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing */}
            <Link href="/pricing">
              <Button variant="ghost">{t("nav.pricing")}</Button>
            </Link>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>{t("nav.resources")}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-6">
                <div className="grid grid-cols-2 gap-4">
                  {resources.map((resource, index) => {
                    const IconComponent = resource.icon
                    return (
                      <DropdownMenuItem key={index} asChild>
                        <Link
                          href={resource.href}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                          <IconComponent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-foreground">{resource.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right-side controls */}
          <div className="hidden lg:flex items-center space-x-2">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost">{t("nav.login")}</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                {t("nav.getStarted")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <div />
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Solutions */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{t("nav.solutions")}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t("nav.solutionsSection.implemented")}
                        </h4>
                        <div className="space-y-2 ml-4">
                          {implementedSolutions.map((solution, index) => (
                            <Link
                              key={index}
                              href={getHref(solution.href)}
                              className="block text-sm text-muted-foreground hover:text-primary"
                              onClick={() => setIsOpen(false)}
                            >
                              {solution.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t("nav.solutionsSection.recent")}
                        </h4>
                        <div className="space-y-2 ml-4">
                          {recentSolutions.map((solution, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <Link
                                href={getHref(solution.href)}
                                className="text-sm text-muted-foreground hover:text-primary"
                                onClick={() => setIsOpen(false)}
                              >
                                {solution.title}
                              </Link>
                              {solution.isNew && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  {t("common.new")}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile other links */}
                  <div className="space-y-4">
                    <Link
                      href="/pricing"
                      className="block text-sm font-medium text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.pricing")}
                    </Link>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t("nav.resources")}</h3>
                      <div className="space-y-2 ml-4">
                        {resources.map((resource, index) => (
                          <Link
                            key={index}
                            href={resource.href}
                            className="block text-sm text-muted-foreground hover:text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            {resource.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="space-y-3 pt-6 border-t">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent">
                        {t("nav.getStarted")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
