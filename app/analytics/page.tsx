"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import AnalyticsDashboard from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute required="view:analytics">
      <AppShell>
        <AnalyticsDashboard />
      </AppShell>
    </ProtectedRoute>
  )
}
