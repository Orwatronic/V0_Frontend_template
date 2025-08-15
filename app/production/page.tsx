"use client"

import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"

export default function ProductionPage() {
  const { t } = useI18n()

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("production.title")}</h1>
        <p className="text-muted-foreground">{t("production.description")}</p>
        {/* CURSOR: API call to GET /api/v1/production/orders */}
      </section>
    </AppShell>
  )
}
