"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import MaterialsManagement from "@/components/materials-management"

export default function MaterialsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <MaterialsManagement />
      </AppShell>
    </ProtectedRoute>
  )
}
