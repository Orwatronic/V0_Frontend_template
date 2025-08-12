"use client"

import { useRouter } from "next/navigation"
import { useI18n } from "@/contexts/i18n-context"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function NotFound() {
  const { t } = useI18n()
  const router = useRouter()

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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FileQuestion className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{t("errors.notFound.title")}</CardTitle>
            <p className="text-gray-600 mt-2">{t("errors.notFound.description")}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
              <p className="text-sm text-gray-500">{t("errors.notFound.subtitle")}</p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                {t("errors.notFound.actions.goHome")}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("errors.notFound.actions.goBack")}
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                {t("errors.notFound.actions.search")}
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">{t("errors.notFound.help")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
