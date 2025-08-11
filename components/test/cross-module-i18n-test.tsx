"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Navigation, Globe, ArrowRight } from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

interface ModuleTest {
  name: string
  path: string
  expectedKeys: string[]
}

const MODULES_TO_TEST: ModuleTest[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    expectedKeys: ["dashboard.welcome", "dashboard.erpModules", "dashboard.recentActivity"],
  },
  {
    name: "Financial Management",
    path: "/financial",
    expectedKeys: [
      "financial.chartOfAccounts.title",
      "financial.accountsPayable.title",
      "financial.journalEntries.title",
    ],
  },
  {
    name: "Sales Management",
    path: "/sales",
    expectedKeys: ["sales.title", "sales.tabs.dashboard", "sales.tabs.pipeline"],
  },
  {
    name: "Materials Management",
    path: "/materials",
    expectedKeys: ["materials.title", "materials.materialMaster.title"],
  },
  {
    name: "Human Capital Management",
    path: "/employees",
    expectedKeys: ["hcm.title", "hcm.tabs.dashboard", "hcm.tabs.employees"],
  },
  {
    name: "Analytics",
    path: "/analytics",
    expectedKeys: ["analytics.title", "analytics.dashboard.title", "analytics.customReports.title"],
  },
  {
    name: "CRM",
    path: "/crm",
    expectedKeys: ["crm.page.title", "crm.dashboard.kpis.newLeads", "crm.dashboard.kpis.conversionRate"],
  },
]

const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "no", name: "Norsk", dir: "ltr" },
]

export default function CrossModuleI18nTest() {
  const { t, locale, setLocale } = useI18n()
  const router = useRouter()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentModule, setCurrentModule] = useState<string>("")
  const [currentLanguage, setCurrentLanguage] = useState<string>("")

  // Test translation key existence across all modules
  const testTranslationKeys = (moduleName: string, keys: string[]): TestResult[] => {
    const results: TestResult[] = []

    keys.forEach((key) => {
      const translation = t(key)
      if (translation === key) {
        results.push({
          name: `${moduleName} - ${key}`,
          status: "fail",
          message: `Missing translation key: ${key}`,
        })
      } else if (translation.includes("{{") || translation.includes("}}")) {
        results.push({
          name: `${moduleName} - ${key}`,
          status: "warning",
          message: `Untranslated interpolation in: ${key}`,
        })
      } else {
        results.push({
          name: `${moduleName} - ${key}`,
          status: "pass",
          message: `Translation found: ${translation.substring(0, 50)}${translation.length > 50 ? "..." : ""}`,
        })
      }
    })

    return results
  }

  // Test language persistence across navigation
  const testLanguagePersistence = async (): Promise<TestResult[]> => {
    const results: TestResult[] = []

    for (const lang of LANGUAGES) {
      setCurrentLanguage(lang.name)
      setLocale(lang.code)

      // Wait for locale to update
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Check if HTML attributes are updated
      const htmlElement = document.documentElement
      const currentLang = htmlElement.getAttribute("lang")
      const currentDir = htmlElement.getAttribute("dir")

      if (currentLang === lang.code) {
        results.push({
          name: `Language Persistence - ${lang.name}`,
          status: "pass",
          message: `HTML lang attribute correctly set to ${lang.code}`,
        })
      } else {
        results.push({
          name: `Language Persistence - ${lang.name}`,
          status: "fail",
          message: `HTML lang attribute should be ${lang.code}, but is ${currentLang}`,
        })
      }

      if (currentDir === lang.dir) {
        results.push({
          name: `Direction Persistence - ${lang.name}`,
          status: "pass",
          message: `HTML dir attribute correctly set to ${lang.dir}`,
        })
      } else {
        results.push({
          name: `Direction Persistence - ${lang.name}`,
          status: "fail",
          message: `HTML dir attribute should be ${lang.dir}, but is ${currentDir}`,
        })
      }
    }

    return results
  }

  // Test RTL layout support
  const testRTLSupport = (): TestResult[] => {
    const results: TestResult[] = []

    // Test if CSS logical properties are used
    const testElements = document.querySelectorAll('[class*="ml-"], [class*="mr-"], [class*="pl-"], [class*="pr-"]')

    if (testElements.length > 0) {
      results.push({
        name: "RTL Support - CSS Classes",
        status: "warning",
        message: `Found ${testElements.length} elements using physical margin/padding classes that may not work with RTL`,
      })
    } else {
      results.push({
        name: "RTL Support - CSS Classes",
        status: "pass",
        message: "No physical margin/padding classes detected",
      })
    }

    // Test Arabic text rendering
    setLocale("ar")
    const arabicText = t("dashboard.welcome")
    if (arabicText && /[\u0600-\u06FF]/.test(arabicText)) {
      results.push({
        name: "RTL Support - Arabic Text",
        status: "pass",
        message: "Arabic text rendering correctly",
      })
    } else {
      results.push({
        name: "RTL Support - Arabic Text",
        status: "fail",
        message: "Arabic text not found or not rendering",
      })
    }

    return results
  }

  // Run comprehensive cross-module tests
  const runCrossModuleTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const allResults: TestResult[] = []

    // Test 1: Language persistence
    setCurrentModule("Language Persistence")
    const persistenceResults = await testLanguagePersistence()
    allResults.push(...persistenceResults)

    // Test 2: RTL support
    setCurrentModule("RTL Support")
    const rtlResults = testRTLSupport()
    allResults.push(...rtlResults)

    // Test 3: Translation keys for each module in each language
    for (const lang of LANGUAGES) {
      setCurrentLanguage(lang.name)
      setLocale(lang.code)
      await new Promise((resolve) => setTimeout(resolve, 200))

      for (const module of MODULES_TO_TEST) {
        setCurrentModule(`${module.name} (${lang.name})`)
        const moduleResults = testTranslationKeys(`${module.name} (${lang.name})`, module.expectedKeys)
        allResults.push(...moduleResults)
      }
    }

    // Test 4: Navigation consistency
    setCurrentModule("Navigation Consistency")
    const navResults = testNavigationConsistency()
    allResults.push(...navResults)

    setTestResults(allResults)
    setIsRunning(false)
    setCurrentModule("")
    setCurrentLanguage("")
  }

  // Test navigation consistency
  const testNavigationConsistency = (): TestResult[] => {
    const results: TestResult[] = []

    // Test sidebar navigation translations
    const sidebarItems = [
      "nav.solutionsItems.dashboard",
      "nav.solutionsItems.financial",
      "nav.solutionsItems.sales",
      "nav.solutionsItems.materials",
      "nav.solutionsItems.hcm",
      "nav.solutionsItems.analytics",
      "nav.solutionsItems.crm",
    ]

    sidebarItems.forEach((key) => {
      const translation = t(key)
      if (translation === key) {
        results.push({
          name: `Navigation - ${key}`,
          status: "fail",
          message: `Missing navigation translation: ${key}`,
        })
      } else {
        results.push({
          name: `Navigation - ${key}`,
          status: "pass",
          message: `Navigation translation found: ${translation}`,
        })
      }
    })

    return results
  }

  const passCount = testResults.filter((r) => r.status === "pass").length
  const failCount = testResults.filter((r) => r.status === "fail").length
  const warningCount = testResults.filter((r) => r.status === "warning").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Cross-Module i18n Integration Tests
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive testing of internationalization across all ERP modules
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runCrossModuleTests} disabled={isRunning} className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {isRunning ? "Running Tests..." : "Run Cross-Module Tests"}
            </Button>

            {testResults.length > 0 && (
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {passCount} Passed
                </Badge>
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  {failCount} Failed
                </Badge>
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {warningCount} Warnings
                </Badge>
              </div>
            )}
          </div>

          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Testing {currentModule} {currentLanguage && `in ${currentLanguage}`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed results from cross-module i18n integration tests</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md border ${
                    result.status === "pass"
                      ? "bg-green-50 border-green-200"
                      : result.status === "fail"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  {result.status === "pass" && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                  {result.status === "fail" && <XCircle className="h-4 w-4 text-red-600 mt-0.5" />}
                  {result.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{result.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Navigation Test */}
      <Card>
        <CardHeader>
          <CardTitle>Module Navigation Test</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test navigation between modules while maintaining language settings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULES_TO_TEST.map((module) => (
              <Button
                key={module.path}
                variant="outline"
                className="flex items-center justify-between p-4 h-auto bg-transparent"
                onClick={() => router.push(module.path)}
              >
                <span className="font-medium">{module.name}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Click any module to navigate and verify that the language setting persists
          </div>
        </CardContent>
      </Card>

      {/* Language Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Language Test Controls</CardTitle>
          <p className="text-sm text-muted-foreground">Switch languages to test cross-module consistency</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant={locale === lang.code ? "default" : "outline"}
                onClick={() => setLocale(lang.code)}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {lang.name}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Current locale: {locale} | Direction: {document.documentElement.getAttribute("dir")}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
