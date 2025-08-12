"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// Fallback translations for when i18n context is not available
const fallbackTranslations = {
  en: {
    "errors.general.title": "Something went wrong",
    "errors.general.description": "We encountered an unexpected error. Please try again.",
    "errors.general.debugInfo": "Debug Information",
    "errors.general.errorId": "Error ID",
    "errors.general.actions.tryAgain": "Try Again",
    "errors.general.actions.goHome": "Go to Dashboard",
    "errors.general.actions.reload": "Reload Page",
    "errors.general.persistentIssue": "If this issue persists, please report it to our support team.",
    "errors.general.actions.reportIssue": "Report Issue",
  },
  ar: {
    "errors.general.title": "حدث خطأ ما",
    "errors.general.description": "واجهنا خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    "errors.general.debugInfo": "معلومات التصحيح",
    "errors.general.errorId": "معرف الخطأ",
    "errors.general.actions.tryAgain": "حاول مرة أخرى",
    "errors.general.actions.goHome": "الذهاب إلى لوحة التحكم",
    "errors.general.actions.reload": "إعادة تحميل الصفحة",
    "errors.general.persistentIssue": "إذا استمرت هذه المشكلة، يرجى الإبلاغ عنها لفريق الدعم.",
    "errors.general.actions.reportIssue": "الإبلاغ عن مشكلة",
  },
  no: {
    "errors.general.title": "Noe gikk galt",
    "errors.general.description": "Vi støtte på en uventet feil. Vennligst prøv igjen.",
    "errors.general.debugInfo": "Feilsøkingsinformasjon",
    "errors.general.errorId": "Feil-ID",
    "errors.general.actions.tryAgain": "Prøv igjen",
    "errors.general.actions.goHome": "Gå til dashbord",
    "errors.general.actions.reload": "Last inn siden på nytt",
    "errors.general.persistentIssue": "Hvis dette problemet vedvarer, vennligst rapporter det til vårt supportteam.",
    "errors.general.actions.reportIssue": "Rapporter problem",
  },
}

function getBrowserLocale(): "en" | "ar" | "no" {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith("ar")) return "ar"
  if (browserLang.startsWith("no") || browserLang.startsWith("nb") || browserLang.startsWith("nn")) return "no"
  return "en"
}

function getStoredLocale(): "en" | "ar" | "no" {
  if (typeof window === "undefined") return "en"

  try {
    const stored = localStorage.getItem("feebee_locale") as "en" | "ar" | "no" | null
    return stored && ["en", "ar", "no"].includes(stored) ? stored : getBrowserLocale()
  } catch {
    return getBrowserLocale()
  }
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter()
  const [locale, setLocale] = useState<"en" | "ar" | "no">("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLocale(getStoredLocale())
  }, [])

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  // Simple translation function using fallback translations
  const t = (key: string): string => {
    if (!mounted) return key

    const translations = fallbackTranslations[locale] || fallbackTranslations.en
    return translations[key as keyof typeof translations] || key
  }

  const isRTL = locale === "ar"

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Something went wrong</CardTitle>
              <p className="text-gray-600 mt-2">We encountered an unexpected error. Please try again.</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Language switcher */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{t("errors.general.title")}</CardTitle>
            <p className="text-gray-600 mt-2">{t("errors.general.description")}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-sm font-medium text-red-800 mb-1">{t("errors.general.debugInfo")}</div>
                <div className="text-xs text-red-600 font-mono break-all">{error.message}</div>
                {error.digest && (
                  <div className="text-xs text-red-500 mt-1">
                    {t("errors.general.errorId")}: {error.digest}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button onClick={reset} className="w-full flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("errors.general.actions.tryAgain")}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                {t("errors.general.actions.goHome")}
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("errors.general.actions.reload")}
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500 mb-2">{t("errors.general.persistentIssue")}</p>
              <Button
                variant="link"
                size="sm"
                className="text-xs h-auto p-0 flex items-center gap-1"
                onClick={() => {
                  // CURSOR: API call to POST /api/v1/support/error-report
                  console.log("Report error:", error.message)
                }}
              >
                <Bug className="h-3 w-3" />
                {t("errors.general.actions.reportIssue")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
