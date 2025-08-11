import { FinancialI18nTest } from "@/components/test/financial-i18n-test"
import { LanguageSwitcherTest } from "@/components/test/language-switcher-test"
import { PhaseBFeaturesTest } from "@/components/test/phase-b-features-test"
import { GovernanceToolsTest } from "@/components/test/governance-tools-test"
import { RTLValidationTest } from "@/components/test/rtl-validation-test"

export default function TestI18nPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">i18n Testing Dashboard</h1>
      <FinancialI18nTest />
      <LanguageSwitcherTest />
      <PhaseBFeaturesTest />
      <GovernanceToolsTest />
      {/* Added RTL validation test component */}
      <RTLValidationTest />
    </div>
  )
}
