"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import HumanCapitalManagement from "@/components/human-capital-management"

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <HumanCapitalManagement />
      </AppShell>
    </ProtectedRoute>
  )
}
