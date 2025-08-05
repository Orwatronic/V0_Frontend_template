"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, Building, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.login.title": "Sign In to ERP",
        "auth.login.subtitle": "Access your enterprise dashboard",
        "auth.login.email": "Email Address",
        "auth.login.emailPlaceholder": "Enter your email",
        "auth.login.password": "Password",
        "auth.login.passwordPlaceholder": "Enter your password",
        "auth.login.company": "Company",
        "auth.login.selectCompany": "Select your company",
        "auth.login.signIn": "Sign In",
        "auth.login.forgotPassword": "Forgot Password?",
        "common.loading": "Loading...",
      }
      return translations[key] || key
    },
  }
}

const LoginPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
          <Globe className="h-4 w-4" />
          <span className="text-sm">EN</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <Card className="shadow-enterprise backdrop-blur-sm bg-white/95 border-white/20">
          <CardHeader className="text-center pb-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-hero-gradient rounded-xl mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Feebee ERP</span>
            </div>

            <CardTitle className="text-2xl font-bold text-foreground mb-2">{t("auth.login.title")}</CardTitle>
            <p className="text-muted-foreground">{t("auth.login.subtitle")}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.login.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.login.emailPlaceholder")}
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.login.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">{t("auth.login.company")}</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <select
                    id="company"
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  >
                    <option value="">{t("auth.login.selectCompany")}</option>
                    <option value="FEEBEE_MAIN">Feebee Technologies</option>
                    <option value="FEEBEE_US">Feebee USA</option>
                    <option value="FEEBEE_EU">Feebee Europe</option>
                  </select>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("auth.login.signIn")}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-6 space-y-2">
              <button
                type="button"
                className="text-sm text-primary hover:underline transition-colors"
                onClick={() => router.push("/forgot-password")}
              >
                {t("auth.login.forgotPassword")}
              </button>

              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>© 2024 Feebee Technologies</span>
                <span>•</span>
                <span>Enterprise ERP System</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
