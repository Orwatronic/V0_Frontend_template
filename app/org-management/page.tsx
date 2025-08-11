import { AppShell } from "@/components/app-shell"

export default function OrgManagementPage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Organizational Management</h1>
        <p className="text-muted-foreground">
          Manage organizations, roles, cost centers, and hierarchies.
        </p>
        {/* CURSOR: API call to GET /api/v1/org/units */}
      </section>
    </AppShell>
  )
}
