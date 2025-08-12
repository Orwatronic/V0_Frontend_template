"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// Fallback translations for global errors
const fallbackTranslations = {
  en: {
    title: "Application Error",
    description: "A critical error occurred. Please refresh the page or contact support.",
    tryAgain: "Try Again",
    goHome: "Go Home",
    debugInfo: "Debug Information",
    errorId: "Error ID",
  },
  ar: {
    title: "خطأ في التطبيق",
    description: "حدث خطأ حرج. يرجى تحديث الصفحة أو الاتصال بالدعم.",
    tryAgain: "حاول مرة أخرى",
    goHome: "الذهاب للرئيسية",
    debugInfo: "معلومات التصحيح",
    errorId: "معرف الخطأ",
  },
  no: {
    title: "Applikasjonsfeil",
    description: "En kritisk feil oppstod. Vennligst oppdater siden eller kontakt support.",
    tryAgain: "Prøv igjen",
    goHome: "Gå hjem",
    debugInfo: "Feilsøkingsinformasjon",
    errorId: "Feil-ID",
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

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [locale, setLocale] = useState<"en" | "ar" | "no">("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLocale(getStoredLocale())
  }, [])

  useEffect(() => {
    console.error("Global application error:", error)
  }, [error])

  const t = (key: keyof typeof fallbackTranslations.en): string => {
    if (!mounted) return key

    const translations = fallbackTranslations[locale] || fallbackTranslations.en
    return translations[key] || key
  }

  const isRTL = locale === "ar"

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${isRTL ? "rtl" : "ltr"}`}>
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{t("title")}</CardTitle>
              <p className="text-gray-600 mt-2">{t("description")}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="text-sm font-medium text-red-800 mb-1">{t("debugInfo")}</div>
                  <div className="text-xs text-red-600 font-mono break-all">{error.message}</div>
                  {error.digest && (
                    <div className="text-xs text-red-500 mt-1">
                      {t("errorId")}: {error.digest}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 pt-4">
                <Button onClick={reset} className="w-full flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {t("tryAgain")}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  {t("goHome")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
