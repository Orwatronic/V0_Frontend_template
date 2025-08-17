"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { formatNumber, formatCurrency, formatDate, formatRelativeTime } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function PhaseBFeaturesTest() {
  const { t, locale, setLocale } = useI18n()
  const [testResults, setTestResults] = useState<
    Array<{ test: string; status: "pass" | "fail" | "warning"; message: string }>
  >([])
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [testInputs, setTestInputs] = useState({
    pluralCount: 5,
    numberValue: 1234567.89,
    currencyAmount: 999.99,
    dateValue: new Date().toISOString().split("T")[0],
  })

  // Capture console logs for missing key detection
  useEffect(() => {
    const originalConsoleWarn = console.warn
    const logs: string[] = []

    console.warn = (...args) => {
      const message = args.join(" ")
      if (message.includes("Missing translation key")) {
        logs.push(message)
        setConsoleLogs([...logs])
      }
      originalConsoleWarn(...args)
    }

    return () => {
      console.warn = originalConsoleWarn
    }
  }, [])

  const runPhaseBTests = () => {
    const results: Array<{ test: string; status: "pass" | "fail" | "warning"; message: string }> = []
    setConsoleLogs([])

    // Test 1: Pluralization
    try {
      const singular = t("test.items", { count: 1 })
      const plural = t("test.items", { count: 5 })

      if (singular !== plural) {
        results.push({ test: "Pluralization", status: "pass", message: `Singular: "${singular}", Plural: "${plural}"` })
      } else {
        results.push({
          test: "Pluralization",
          status: "warning",
          message: "Pluralization may not be working - same result for singular/plural",
        })
      }
    } catch (error) {
      results.push({ test: "Pluralization", status: "fail", message: `Error: ${error}` })
    }

    // Test 2: Number Formatting
    try {
      const formatted = formatNumber(testInputs.numberValue, locale)
      const isValidFormat = formatted !== testInputs.numberValue.toString()

      results.push({
        test: "Number Formatting",
        status: isValidFormat ? "pass" : "warning",
        message: `${testInputs.numberValue} → ${formatted}`,
      })
    } catch (error) {
      results.push({ test: "Number Formatting", status: "fail", message: `Error: ${error}` })
    }

    // Test 3: Currency Formatting
    try {
      const formatted = formatCurrency(testInputs.currencyAmount, locale, "USD")
      const hasCurrencySymbol = formatted.includes("$") || formatted.includes("USD")

      results.push({
        test: "Currency Formatting",
        status: hasCurrencySymbol ? "pass" : "warning",
        message: `${testInputs.currencyAmount} → ${formatted}`,
      })
    } catch (error) {
      results.push({ test: "Currency Formatting", status: "fail", message: `Error: ${error}` })
    }

    // Test 4: Date Formatting
    try {
      const date = new Date(testInputs.dateValue)
      const formatted = formatDate(date, locale)
      const isValidDate = formatted !== "Invalid Date" && formatted !== testInputs.dateValue

      results.push({
        test: "Date Formatting",
        status: isValidDate ? "pass" : "fail",
        message: `${testInputs.dateValue} → ${formatted}`,
      })
    } catch (error) {
      results.push({ test: "Date Formatting", status: "fail", message: `Error: ${error}` })
    }

    // Test 5: Relative Time Formatting
    try {
      const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      const formatted = formatRelativeTime(pastDate, locale)
      const isRelative = formatted.includes("ago") || formatted.includes("hours") || formatted.includes("ساعات")

      results.push({
        test: "Relative Time",
        status: isRelative ? "pass" : "warning",
        message: `2 hours ago → ${formatted}`,
      })
    } catch (error) {
      results.push({ test: "Relative Time", status: "fail", message: `Error: ${error}` })
    }

    // Test 6: Missing Key Detection
    try {
      const missingKey = t("this.key.does.not.exist")
      setTimeout(() => {
        const hasWarning = consoleLogs.some((log) => log.includes("this.key.does.not.exist"))
        const updatedResults = [...results]
        updatedResults.push({
          test: "Missing Key Detection",
          status: hasWarning ? "pass" : "fail",
          message: hasWarning ? "Missing key warning logged correctly" : "No warning logged for missing key",
        })
        setTestResults(updatedResults)
      }, 100)

      results.push({
        test: "Missing Key Detection",
        status: "warning",
        message: "Checking console logs...",
      })
    } catch (error) {
      results.push({ test: "Missing Key Detection", status: "fail", message: `Error: ${error}` })
    }

    setTestResults(results)
  }

  const testPseudoLocale = () => {
    setLocale("en-XA" as any)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Phase B Features Test Suite</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runPhaseBTests}>Run Phase B Tests</Button>
          <Button variant="outline" onClick={testPseudoLocale}>
            Test Pseudo-Locale
          </Button>
          <Button variant="outline" onClick={() => setLocale("en")}>
            Reset to English
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded">
          <div>
            <Label htmlFor="pluralCount">Plural Count</Label>
            <Input
              id="pluralCount"
              type="number"
              value={testInputs.pluralCount}
              onChange={(e) =>
                setTestInputs((prev) => ({ ...prev, pluralCount: Number.parseInt(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="numberValue">Number Value</Label>
            <Input
              id="numberValue"
              type="number"
              step="0.01"
              value={testInputs.numberValue}
              onChange={(e) =>
                setTestInputs((prev) => ({ ...prev, numberValue: Number.parseFloat(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="currencyAmount">Currency Amount</Label>
            <Input
              id="currencyAmount"
              type="number"
              step="0.01"
              value={testInputs.currencyAmount}
              onChange={(e) =>
                setTestInputs((prev) => ({ ...prev, currencyAmount: Number.parseFloat(e.target.value) || 0 }))
              }
            />
          </div>
          <div>
            <Label htmlFor="dateValue">Date Value</Label>
            <Input
              id="dateValue"
              type="date"
              value={testInputs.dateValue}
              onChange={(e) => setTestInputs((prev) => ({ ...prev, dateValue: e.target.value }))}
            />
          </div>
        </div>

        {/* Live Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <h4 className="font-medium mb-2">Live Formatting Examples</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Number:</strong> {formatNumber(testInputs.numberValue, locale)}
              </p>
              <p>
                <strong>Currency:</strong> {formatCurrency(testInputs.currencyAmount, locale, "USD")}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(new Date(testInputs.dateValue), locale)}
              </p>
              <p>
                <strong>Relative:</strong> {formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000), locale)}
              </p>
            </div>
          </div>
          <div className="p-3 border rounded">
            <h4 className="font-medium mb-2">Current Locale Info</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Locale:</strong> {locale}
              </p>
              <p>
                <strong>Direction:</strong> {document.documentElement.getAttribute("dir")}
              </p>
              <p>
                <strong>Pseudo-locale:</strong> {locale === "en-XA" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {result.status === "pass" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {result.status === "fail" && <XCircle className="w-5 h-5 text-red-500" />}
                  {result.status === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
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

        {/* Console Logs */}
        {consoleLogs.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Console Warnings:</h3>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded max-h-32 overflow-y-auto">
              {consoleLogs.map((log, index) => (
                <p key={index} className="text-xs font-mono text-yellow-800">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
