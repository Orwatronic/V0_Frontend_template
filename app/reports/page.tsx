"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import CustomReportBuilder from "@/components/custom-report-builder"

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <CustomReportBuilder />
      </AppShell>
    </ProtectedRoute>
  )
}
