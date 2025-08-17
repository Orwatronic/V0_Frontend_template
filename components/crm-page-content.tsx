"use client"

import CrmDashboard from "@/components/crm-dashboard"
import { useI18n } from "@/contexts/i18n-context"

/**
 * Note: This component MUST NOT render AppShell to avoid duplicate
 * sidebar/header. The page component (app/crm/page.tsx) wraps with AppShell.
 * This mirrors the composition used in other modules.
 */
export default function CrmPageContent() {
  const { t } = useI18n()

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t("crm.page.title")}>
      <CrmDashboard />
    </main>
  )
}
