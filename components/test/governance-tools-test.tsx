"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, AlertTriangle, Terminal, FileText } from "lucide-react"

export function GovernanceToolsTest() {
  const [testResults, setTestResults] = useState<
    Array<{ test: string; status: "pass" | "fail" | "info"; message: string }>
  >([])
  const [scriptOutput, setScriptOutput] = useState<string>("")

  const runGovernanceTests = async () => {
    const results: Array<{ test: string; status: "pass" | "fail" | "info"; message: string }> = []

    // Test 1: Check if governance scripts exist
    try {
      const scriptsExist = await fetch("/scripts/check-i18n-keys.ts")
        .then((res) => res.ok)
        .catch(() => false)

      results.push({
        test: "Governance Scripts Exist",
        status: scriptsExist ? "pass" : "fail",
        message: scriptsExist ? "Scripts found in /scripts directory" : "Scripts not found",
      })
    } catch (error) {
      results.push({
        test: "Governance Scripts Exist",
        status: "fail",
        message: `Error checking scripts: ${error}`,
      })
    }

    // Test 2: Package.json scripts
    try {
      const packageJson = await fetch("/package.json").then((res) => res.json())
      const hasI18nScripts =
        packageJson.scripts && packageJson.scripts["check:i18n"] && packageJson.scripts["check:hardcoded-strings"]

      results.push({
        test: "NPM Scripts Configuration",
        status: hasI18nScripts ? "pass" : "fail",
        message: hasI18nScripts
          ? "i18n check scripts configured in package.json"
          : "Missing i18n scripts in package.json",
      })
    } catch (error) {
      results.push({
        test: "NPM Scripts Configuration",
        status: "fail",
        message: `Error reading package.json: ${error}`,
      })
    }

    // Test 3: Translation key validation (simulated)
    const mockTranslationCheck = () => {
      const englishKeys = [
        "financial.chartOfAccounts.title",
        "financial.accountsPayable.title",
        "financial.journalEntries.title",
      ]
      const arabicKeys = ["financial.chartOfAccounts.title", "financial.accountsPayable.title"] // Missing one key
      const missingKeys = englishKeys.filter((key) => !arabicKeys.includes(key))

      return {
        hasIssues: missingKeys.length > 0,
        missingKeys,
        totalChecked: englishKeys.length,
      }
    }

    const translationCheck = mockTranslationCheck()
    results.push({
      test: "Translation Key Validation",
      status: translationCheck.hasIssues ? "fail" : "pass",
      message: translationCheck.hasIssues
        ? `Missing ${translationCheck.missingKeys.length} keys in Arabic locale`
        : `All ${translationCheck.totalChecked} keys validated successfully`,
    })

    // Test 4: Hardcoded string detection (simulated)
    const mockHardcodedCheck = () => {
      const suspiciousPatterns = [
        { file: "components/example.tsx", line: 15, text: '"Click here"' },
        { file: "components/another.tsx", line: 23, text: '"Submit Form"' },
      ]
      return {
        hasIssues: suspiciousPatterns.length > 0,
        patterns: suspiciousPatterns,
      }
    }

    const hardcodedCheck = mockHardcodedCheck()
    results.push({
      test: "Hardcoded String Detection",
      status: hardcodedCheck.hasIssues ? "fail" : "pass",
      message: hardcodedCheck.hasIssues
        ? `Found ${hardcodedCheck.patterns.length} potential hardcoded strings`
        : "No hardcoded strings detected",
    })

    // Test 5: Missing key detection in runtime
    results.push({
      test: "Runtime Missing Key Detection",
      status: "info",
      message: "Check browser console for missing key warnings when using t() function",
    })

    setTestResults(results)

    // Generate mock script output
    const mockOutput = `
🔍 i18n Key Validation Report
============================

Checking translation keys across locales...

✅ English (en): 156 keys
❌ Arabic (ar): 154 keys (2 missing)
❌ Norwegian (no): 155 keys (1 missing)

Missing keys in Arabic:
- financial.journalEntries.newEntry
- financial.financialReporting.exportPdf

Missing keys in Norwegian:
- financial.accountsReceivable.overdue

🔍 Hardcoded String Detection Report
===================================

Scanning components for hardcoded strings...

Found 3 potential issues:
- components/example.tsx:15 - "Click here"
- components/another.tsx:23 - "Submit Form"  
- components/test.tsx:8 - "Loading..."

Recommendation: Replace with t() function calls
`
    setScriptOutput(mockOutput)
  }

  const clearResults = () => {
    setTestResults([])
    setScriptOutput("")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Governance Tools & CI Checks Test Suite</CardTitle>
        <div className="flex gap-2">
          <Button onClick={runGovernanceTests}>
            <Terminal className="w-4 h-4 mr-2" />
            Run Governance Tests
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Testing Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Manual Testing Instructions
          </h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>To test governance tools manually:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>
                Run <code className="bg-gray-100 px-1 rounded">npm run check:i18n</code> to validate translation keys
              </li>
              <li>
                Run <code className="bg-gray-100 px-1 rounded">npm run check:hardcoded-strings</code> to detect
                hardcoded strings
              </li>
              <li>
                Run <code className="bg-gray-100 px-1 rounded">npm run lint:i18n</code> to run both checks together
              </li>
              <li>Check that scripts exit with proper error codes for CI integration</li>
              <li>Verify that missing translation keys are logged to console during development</li>
            </ol>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Automated Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {result.status === "pass" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {result.status === "fail" && <XCircle className="w-5 h-5 text-red-500" />}
                  {result.status === "info" && <AlertTriangle className="w-5 h-5 text-blue-500" />}
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

        {/* Mock Script Output */}
        {scriptOutput && (
          <div className="space-y-2">
            <h3 className="font-semibold">Sample Script Output:</h3>
            <Textarea
              value={scriptOutput}
              readOnly
              className="font-mono text-xs h-64 bg-gray-50"
              placeholder="Script output will appear here..."
            />
          </div>
        )}

        {/* CI Integration Guide */}
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold mb-2">CI/CD Integration</h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>GitHub Actions example:</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`- name: Check i18n compliance
  run: |
    npm run check:i18n
    npm run check:hardcoded-strings
- name: Fail on i18n issues
  run: npm run lint:i18n`}
            </pre>
            <p className="text-green-700">
              <strong>✅ Benefits:</strong> Prevents deployment of code with missing translations or hardcoded strings
            </p>
          </div>
        </div>

        {/* Development Workflow */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Development Workflow</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>1. Pre-commit:</strong> Run <code>npm run lint:i18n</code> before committing
            </p>
            <p>
              <strong>2. PR Review:</strong> CI automatically checks i18n compliance
            </p>
            <p>
              <strong>3. Translation Freeze:</strong> Lock translations before release
            </p>
            <p>
              <strong>4. Missing Keys:</strong> Dev warnings appear in console for missing translations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
