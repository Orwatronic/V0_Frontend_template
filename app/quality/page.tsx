import { AppShell } from "@/components/app-shell"

export default function QualityPage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Quality Management</h1>
        <p className="text-muted-foreground">
          Inspections, non-conformances, and corrective actions.
        </p>
        {/* CURSOR: API call to GET /api/v1/quality/inspections */}
      </section>
    </AppShell>
  )
}
