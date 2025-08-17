"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/contexts/i18n-context"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // Safe i18n fallback: if the error boundary renders outside provider, use identity translator
  let t: (key: string) => string = (key) => key
  try {
    t = useI18n().t
  } catch {
    // ignore – provider not available in this render path
  }
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Language switcher */}
      <div className="absolute top-4 right-4">
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
