import { AppShell } from "@/components/app-shell"

export default function ProjectSystemPage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Project System</h1>
        <p className="text-muted-foreground">
          Projects, WBS elements, and progress tracking.
        </p>
        {/* CURSOR: API call to GET /api/v1/projects */}
      </section>
    </AppShell>
  )
}
