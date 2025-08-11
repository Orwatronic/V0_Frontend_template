import { AppShell } from "@/components/app-shell"

export default function ProductionPage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Production</h1>
        <p className="text-muted-foreground">
          Plan and monitor production orders and capacity.
        </p>
        {/* CURSOR: API call to GET /api/v1/production/orders */}
      </section>
    </AppShell>
  )
}
