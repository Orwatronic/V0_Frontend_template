import { AppShell } from "@/components/app-shell"

export default function PlantMaintenancePage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Plant Maintenance</h1>
        <p className="text-muted-foreground">
          Manage assets, maintenance orders, and schedules.
        </p>
        {/* CURSOR: API call to GET /api/v1/maintenance/orders */}
      </section>
    </AppShell>
  )
}
