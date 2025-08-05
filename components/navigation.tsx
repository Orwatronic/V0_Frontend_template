"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "navigation.solutions": "Solutions",
        "navigation.features": "Features",
        "navigation.pricing": "Pricing",
        "navigation.resources": "Resources",
        "navigation.company": "Company",
        "navigation.cta": "Log In",
        "navigation.logo": "EnterpriseERP",
        "navigation.tagline": "by Feebee Technologies",
      }
      return translations[key] || key
    },
  }
}

const Navigation = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      label: t("navigation.solutions"),
      href: "/solutions",
      hasDropdown: true,
    },
    {
      label: t("navigation.features"),
      href: "/features",
    },
    {
      label: t("navigation.pricing"),
      href: "/pricing",
    },
    {
      label: t("navigation.resources"),
      href: "/resources",
      hasDropdown: true,
    },
    {
      label: t("navigation.company"),
      href: "/company",
      hasDropdown: true,
    },
  ]

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl leading-tight">{t("navigation.logo")}</span>
              <span className="text-blue-200 text-xs leading-tight">{t("navigation.tagline")}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => router.push(item.href)}
                  className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors duration-200 font-medium"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                </button>

                {/* Dropdown indicator */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <Button
              variant="default"
              onClick={() => router.push("/login")}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 shadow-lg"
            >
              Log In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-bold text-xl leading-tight">{t("navigation.logo")}</span>
                      <span className="text-blue-600 text-xs leading-tight">{t("navigation.tagline")}</span>
                    </div>
                  </div>

                  {/* Mobile Navigation Items */}
                  {navigationItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        router.push(item.href)
                        setIsOpen(false)
                      }}
                      className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg py-2"
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </button>
                  ))}

                  {/* Mobile CTA Button */}
                  <div className="pt-6 border-t">
                    <Button
                      variant="default"
                      onClick={() => {
                        router.push("/login")
                        setIsOpen(false)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3"
                    >
                      Log In
                    </Button>
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
