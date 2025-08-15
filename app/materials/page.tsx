"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import MaterialsManagement from "@/components/materials-management"

export default function MaterialsPage() {
  return (
    <ProtectedRoute required="view:materials">
      <AppShell>
        <MaterialsManagement />
      </AppShell>
    </ProtectedRoute>
  )
}
