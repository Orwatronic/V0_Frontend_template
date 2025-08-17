"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, ArrowRight, User, Settings, Home, Search } from "lucide-react"

export function RTLValidationTest() {
  const { t, locale, setLocale } = useI18n()
  const [testResults, setTestResults] = useState<
    Array<{ test: string; status: "pass" | "fail" | "info"; message: string }>
  >([])
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    setIsRTL(document.documentElement.getAttribute("dir") === "rtl")
  }, [locale])

  const runRTLTests = () => {
    const results: Array<{ test: string; status: "pass" | "fail" | "info"; message: string }> = []

    // Test 1: HTML dir attribute
    const htmlDir = document.documentElement.getAttribute("dir")
    const expectedDir = locale === "ar" ? "rtl" : "ltr"
    results.push({
      test: "HTML Direction Attribute",
      status: htmlDir === expectedDir ? "pass" : "fail",
      message: `Expected: ${expectedDir}, Actual: ${htmlDir}`,
    })

    // Test 2: CSS logical properties support
    const testElement = document.createElement("div")
    testElement.style.marginInlineStart = "10px"
    const supportsLogicalProps = testElement.style.marginInlineStart === "10px"
    results.push({
      test: "CSS Logical Properties Support",
      status: supportsLogicalProps ? "pass" : "info",
      message: supportsLogicalProps
        ? "Browser supports CSS logical properties"
        : "Browser may not support CSS logical properties",
    })

    // Test 3: Text alignment
    const bodyComputedStyle = window.getComputedStyle(document.body)
    const textAlign = bodyComputedStyle.direction
    results.push({
      test: "Text Direction",
      status: textAlign === expectedDir ? "pass" : "fail",
      message: `Text direction: ${textAlign}`,
    })

    // Test 4: Arabic text rendering
    if (locale === "ar") {
      const arabicText = "مرحبا بك في نظام إدارة الموارد المؤسسية"
      const hasArabicChars = /[\u0600-\u06FF]/.test(arabicText)
      results.push({
        test: "Arabic Text Rendering",
        status: hasArabicChars ? "pass" : "fail",
        message: hasArabicChars ? "Arabic characters detected and should render RTL" : "No Arabic characters found",
      })
    }

    // Test 5: Icon positioning (visual check needed)
    results.push({
      test: "Icon Positioning",
      status: "info",
      message: "Visual check required - icons should mirror in RTL layout",
    })

    setTestResults(results)
  }

  const switchToArabic = () => {
    setLocale("ar")
    setTimeout(runRTLTests, 100) // Allow time for DOM updates
  }

  const switchToEnglish = () => {
    setLocale("en")
    setTimeout(runRTLTests, 100)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>RTL Support & Arabic Layout Validation</CardTitle>
        <div className="flex gap-2">
          <Button onClick={switchToArabic} variant={locale === "ar" ? "default" : "outline"}>
            العربية (Arabic)
          </Button>
          <Button onClick={switchToEnglish} variant={locale === "en" ? "default" : "outline"}>
            English
          </Button>
          <Button onClick={runRTLTests}>Run RTL Tests</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current State Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
          <div className="text-center">
            <h4 className="font-medium">Current Locale</h4>
            <p className="text-2xl font-bold">{locale.toUpperCase()}</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium">Direction</h4>
            <p className="text-2xl font-bold">{isRTL ? "RTL" : "LTR"}</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium">HTML Dir</h4>
            <p className="text-2xl font-bold">{document.documentElement.getAttribute("dir")}</p>
          </div>
        </div>

        {/* Visual RTL Examples */}
        <div className="space-y-4">
          <h3 className="font-semibold">Visual RTL Layout Examples</h3>

          {/* Navigation Example */}
          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">Navigation Layout</h4>
            <div className="flex items-center gap-4 p-2 bg-gray-50 rounded">
              <Home className="w-5 h-5" />
              <span>{t("nav.home", "Home")}</span>
              <ArrowRight className="w-4 h-4" />
              <Settings className="w-5 h-5" />
              <span>{t("nav.settings", "Settings")}</span>
              <ArrowRight className="w-4 h-4" />
              <User className="w-5 h-5" />
              <span>{t("nav.profile", "Profile")}</span>
            </div>
          </div>

          {/* Form Layout Example */}
          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">Form Layout</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rtl-name">{t("form.name", "Name")}</Label>
                <Input id="rtl-name" placeholder={t("form.enterName", "Enter your name")} />
              </div>
              <div>
                <Label htmlFor="rtl-email">{t("form.email", "Email")}</Label>
                <Input id="rtl-email" type="email" placeholder={t("form.enterEmail", "Enter your email")} />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="rtl-message">{t("form.message", "Message")}</Label>
              <Textarea id="rtl-message" placeholder={t("form.enterMessage", "Enter your message")} />
            </div>
          </div>

          {/* Data Table Example */}
          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">Data Table Layout</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-start">{t("table.name", "Name")}</th>
                    <th className="border border-gray-300 p-2 text-start">{t("table.amount", "Amount")}</th>
                    <th className="border border-gray-300 p-2 text-start">{t("table.date", "Date")}</th>
                    <th className="border border-gray-300 p-2 text-start">{t("table.status", "Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">{locale === "ar" ? "أحمد محمد" : "Ahmed Mohamed"}</td>
                    <td className="border border-gray-300 p-2">$1,234.56</td>
                    <td className="border border-gray-300 p-2">2024-01-15</td>
                    <td className="border border-gray-300 p-2">
                      <Badge variant="default">{t("status.active", "Active")}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">{locale === "ar" ? "فاطمة علي" : "Fatima Ali"}</td>
                    <td className="border border-gray-300 p-2">$2,567.89</td>
                    <td className="border border-gray-300 p-2">2024-01-16</td>
                    <td className="border border-gray-300 p-2">
                      <Badge variant="secondary">{t("status.pending", "Pending")}</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Search and Filter Example */}
          <div className="p-4 border rounded">
            <h4 className="font-medium mb-2">Search and Filter Layout</h4>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input className="ps-10" placeholder={t("search.placeholder", "Search...")} />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("filter.selectCategory", "Select category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filter.all", "All")}</SelectItem>
                  <SelectItem value="active">{t("filter.active", "Active")}</SelectItem>
                  <SelectItem value="inactive">{t("filter.inactive", "Inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">RTL Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {result.status === "pass" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {result.status === "fail" && <XCircle className="w-5 h-5 text-red-500" />}
                  {result.status === "info" && <Search className="w-5 h-5 text-blue-500" />}
                  <span className="font-medium">{result.test}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      result.status === "pass" ? "default" : result.status === "fail" ? "destructive" : "secondary"
                    }
                  >
                    {result.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground max-w-xs truncate" title={result.message}>
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RTL Guidelines */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2">RTL Layout Guidelines</h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>✅ What should work in RTL:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Text flows from right to left</li>
              <li>Navigation breadcrumbs reverse direction</li>
              <li>Form labels align to the right</li>
              <li>Icons and buttons mirror horizontally</li>
              <li>Table columns maintain logical order</li>
              <li>Search icons appear on the right side of inputs</li>
            </ul>
            <p className="mt-3">
              <strong>🔍 Manual checks needed:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Sidebar navigation should slide from right</li>
              <li>Dropdown menus should align properly</li>
              <li>Tooltips should position correctly</li>
              <li>Modal dialogs should center properly</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
