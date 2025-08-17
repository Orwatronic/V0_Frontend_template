"use client"

import { useState } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export function LanguageSwitcherTest() {
  const { locale, setLocale } = useI18n()
  const [testResults, setTestResults] = useState<
    Array<{ test: string; status: "pass" | "fail" | "pending"; message: string }>
  >([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const results: Array<{ test: string; status: "pass" | "fail" | "pending"; message: string }> = []

    // Test 1: Locale switching
    results.push({
      test: "Locale Switching",
      status: "pending",
      message: "Testing locale changes...",
    })
    setTestResults([...results])

    const originalLocale = locale
    setLocale("ar")
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (locale === "ar") {
      results[0] = { test: "Locale Switching", status: "pass", message: "Locale successfully changed to Arabic" }
    } else {
      results[0] = { test: "Locale Switching", status: "fail", message: "Locale did not change to Arabic" }
    }
    setTestResults([...results])

    // Test 2: HTML attributes
    results.push({
      test: "HTML Attributes",
      status: "pending",
      message: "Checking HTML lang and dir attributes...",
    })
    setTestResults([...results])

    const htmlElement = document.documentElement
    const hasCorrectLang = htmlElement.getAttribute("lang") === "ar"
    const hasCorrectDir = htmlElement.getAttribute("dir") === "rtl"

    if (hasCorrectLang && hasCorrectDir) {
      results[1] = { test: "HTML Attributes", status: "pass", message: "HTML lang='ar' and dir='rtl' set correctly" }
    } else {
      results[1] = {
        test: "HTML Attributes",
        status: "fail",
        message: `HTML attributes incorrect: lang=${htmlElement.getAttribute("lang")}, dir=${htmlElement.getAttribute("dir")}`,
      }
    }
    setTestResults([...results])

    // Test 3: LocalStorage persistence
    results.push({
      test: "LocalStorage Persistence",
      status: "pending",
      message: "Checking localStorage persistence...",
    })
    setTestResults([...results])

    const storedLocale = localStorage.getItem("locale")
    if (storedLocale === "ar") {
      results[2] = {
        test: "LocalStorage Persistence",
        status: "pass",
        message: "Locale correctly stored in localStorage",
      }
    } else {
      results[2] = {
        test: "LocalStorage Persistence",
        status: "fail",
        message: `LocalStorage value incorrect: ${storedLocale}`,
      }
    }
    setTestResults([...results])

    // Test 4: Switch to Norwegian
    results.push({
      test: "Norwegian Locale",
      status: "pending",
      message: "Testing Norwegian locale switch...",
    })
    setTestResults([...results])

    setLocale("no")
    await new Promise((resolve) => setTimeout(resolve, 100))

    const htmlLangNo = document.documentElement.getAttribute("lang")
    const htmlDirNo = document.documentElement.getAttribute("dir")

    if (htmlLangNo === "no" && htmlDirNo === "ltr") {
      results[3] = {
        test: "Norwegian Locale",
        status: "pass",
        message: "Norwegian locale with LTR direction set correctly",
      }
    } else {
      results[3] = {
        test: "Norwegian Locale",
        status: "fail",
        message: `Norwegian attributes incorrect: lang=${htmlLangNo}, dir=${htmlDirNo}`,
      }
    }
    setTestResults([...results])

    // Test 5: Return to original locale
    setLocale(originalLocale)
    await new Promise((resolve) => setTimeout(resolve, 100))

    results.push({
      test: "Locale Restoration",
      status: locale === originalLocale ? "pass" : "fail",
      message:
        locale === originalLocale ? "Successfully restored original locale" : "Failed to restore original locale",
    })
    setTestResults([...results])

    setIsRunning(false)
  }

  const clearTests = () => {
    setTestResults([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Language Switcher & Persistence Test Suite</CardTitle>
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
            {isRunning ? "Running Tests..." : "Run Tests"}
          </Button>
          <Button variant="outline" onClick={clearTests}>
            Clear Results
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 border rounded">
            <h4 className="font-medium">Current Locale</h4>
            <p className="text-2xl font-bold">{locale.toUpperCase()}</p>
          </div>
          <div className="p-3 border rounded">
            <h4 className="font-medium">HTML Lang</h4>
            <p className="text-2xl font-bold">{document.documentElement.getAttribute("lang")}</p>
          </div>
          <div className="p-3 border rounded">
            <h4 className="font-medium">HTML Dir</h4>
            <p className="text-2xl font-bold">{document.documentElement.getAttribute("dir")}</p>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {result.status === "pass" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {result.status === "fail" && <XCircle className="w-5 h-5 text-red-500" />}
                  {result.status === "pending" && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
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

            {!isRunning && testResults.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded">
                <p className="text-sm">
                  <strong>Summary:</strong> {testResults.filter((r) => r.status === "pass").length} passed,{" "}
                  {testResults.filter((r) => r.status === "fail").length} failed
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded border">
          <h3 className="font-semibold mb-2">Manual Tests:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Navigate to different pages and verify language switcher is visible in AppShell header</li>
            <li>Switch languages and verify all navigation items translate correctly</li>
            <li>Refresh the page and verify the selected language persists</li>
            <li>Check that Arabic text displays right-to-left correctly</li>
            <li>Verify keyboard navigation works properly in all languages</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
