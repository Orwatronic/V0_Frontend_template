"use client"

import { useState } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FinancialI18nTest() {
  const { t, locale, setLocale } = useI18n()
  const [testResults, setTestResults] = useState<Array<{ key: string; status: "pass" | "fail"; value: string }>>([])

  // Test all Financial Management translation keys
  const testKeys = [
    "financial.chartOfAccounts.title",
    "financial.chartOfAccounts.description",
    "financial.accountsPayable.title",
    "financial.accountsPayable.totalOutstanding",
    "financial.accountsReceivable.title",
    "financial.accountsReceivable.totalReceivable",
    "financial.journalEntries.title",
    "financial.journalEntries.newEntry",
    "financial.financialReporting.title",
    "financial.financialReporting.generateReport",
  ]

  const runTests = () => {
    const results = testKeys.map((key) => {
      const value = t(key)
      const status = value === key ? "fail" : "pass" // If translation returns the key, it's missing
      return { key, status, value }
    })
    setTestResults(results)
  }

  const testLanguages = ["en", "ar", "no"]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Management i18n Test Suite</CardTitle>
        <div className="flex gap-2">
          {testLanguages.map((lang) => (
            <Button
              key={lang}
              variant={locale === lang ? "default" : "outline"}
              size="sm"
              onClick={() => setLocale(lang as any)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p>
            Current Locale: <strong>{locale}</strong>
          </p>
          <Button onClick={runTests}>Run Translation Tests</Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result) => (
              <div key={result.key} className="flex items-center justify-between p-2 border rounded">
                <span className="font-mono text-sm">{result.key}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={result.status === "pass" ? "default" : "destructive"}>{result.status}</Badge>
                  <span className="text-sm max-w-xs truncate" title={result.value}>
                    {result.value}
                  </span>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-muted rounded">
              <p className="text-sm">
                <strong>Summary:</strong> {testResults.filter((r) => r.status === "pass").length} passed,{" "}
                {testResults.filter((r) => r.status === "fail").length} failed
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">Sample Translations:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <h4 className="font-medium">{t("financial.chartOfAccounts.title")}</h4>
              <p className="text-sm text-muted-foreground">{t("financial.chartOfAccounts.description")}</p>
            </div>
            <div className="p-3 border rounded">
              <h4 className="font-medium">{t("financial.accountsPayable.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("financial.accountsPayable.totalOutstanding")}:{" "}
                {t("financial.accountsPayable.currency", { amount: 125000 })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
