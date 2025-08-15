"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import SalesDistribution from "@/components/sales-distribution"

export default function SalesPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <SalesDistribution />
      </AppShell>
    </ProtectedRoute>
  )
}
