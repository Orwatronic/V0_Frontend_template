"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import DashboardOverview from "@/components/dashboard-overview"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardOverview />
      </AppShell>
    </ProtectedRoute>
  )
}
