import { FinancialI18nTest } from "@/components/test/financial-i18n-test"
import { LanguageSwitcherTest } from "@/components/test/language-switcher-test"
import { PhaseBFeaturesTest } from "@/components/test/phase-b-features-test"
import { GovernanceToolsTest } from "@/components/test/governance-tools-test"
import { RTLValidationTest } from "@/components/test/rtl-validation-test"
import CrossModuleI18nTest from "@/components/test/cross-module-i18n-test"
import { I18nDiagnosticTest } from "@/components/test/i18n-diagnostic-test"

export default function TestI18nPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">i18n Testing Dashboard</h1>
      <I18nDiagnosticTest />
      <FinancialI18nTest />
      <LanguageSwitcherTest />
      <PhaseBFeaturesTest />
      <GovernanceToolsTest />
      <RTLValidationTest />
      <CrossModuleI18nTest />
    </div>
  )
}
