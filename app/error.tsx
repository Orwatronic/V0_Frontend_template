"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

// Standalone translation function for error boundaries (no context dependency)
function getErrorTranslation(key: string, locale?: string) {
  const translations = {
    en: {
      "error.title": "Something went wrong",
      "error.description": "An unexpected error occurred. Please try refreshing the page.",
      "error.tryAgain": "Try again",
      "error.goHome": "Go to Dashboard",
    },
    ar: {
      "error.title": "حدث خطأ ما",
      "error.description": "حدث خطأ غير متوقع. يرجى محاولة تحديث الصفحة.",
      "error.tryAgain": "حاول مرة أخرى",
      "error.goHome": "الذهاب إلى لوحة التحكم",
    },
    no: {
      "error.title": "Noe gikk galt",
      "error.description": "En uventet feil oppstod. Vennligst prøv å oppdatere siden.",
      "error.tryAgain": "Prøv igjen",
      "error.goHome": "Gå til Dashboard",
    },
  }

  const currentLocale = locale || "en"
  return translations[currentLocale as keyof typeof translations]?.[key] || translations.en[key] || key
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  // Get locale from localStorage or default to 'en'
  const locale = typeof window !== "undefined" ? localStorage.getItem("feebee_locale") || "en" : "en"

  const isRTL = locale === "ar"

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {getErrorTranslation("error.title", locale)}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getErrorTranslation("error.description", locale)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={reset} className="w-full" variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                {getErrorTranslation("error.tryAgain", locale)}
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="w-full">
                {getErrorTranslation("error.goHome", locale)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
