"use client"

import { useEffect } from "react"

// Standalone translation function for global errors (no context dependency)
function getGlobalErrorTranslation(key: string, locale?: string) {
  const translations = {
    en: {
      "globalError.title": "Application Error",
      "globalError.description": "A critical error occurred. Please refresh the page or contact support.",
      "globalError.refresh": "Refresh Page",
    },
    ar: {
      "globalError.title": "خطأ في التطبيق",
      "globalError.description": "حدث خطأ حرج. يرجى تحديث الصفحة أو الاتصال بالدعم.",
      "globalError.refresh": "تحديث الصفحة",
    },
    no: {
      "globalError.title": "Applikasjonsfeil",
      "globalError.description": "En kritisk feil oppstod. Vennligst oppdater siden eller kontakt support.",
      "globalError.refresh": "Oppdater side",
    },
  }

  const currentLocale = locale || "en"
  return translations[currentLocale as keyof typeof translations]?.[key] || translations.en[key] || key
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global application error:", error)
  }, [error])

  // Get locale from localStorage or default to 'en'
  const locale = typeof window !== "undefined" ? localStorage.getItem("feebee_locale") || "en" : "en"

  const isRTL = locale === "ar"

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getGlobalErrorTranslation("globalError.title", locale)}
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
              {getGlobalErrorTranslation("globalError.description", locale)}
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {getGlobalErrorTranslation("globalError.refresh", locale)}
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
