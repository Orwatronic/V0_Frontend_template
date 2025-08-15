"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import FinancialManagementContainer from "@/components/financial-management-container"

export default function FinancialPage() {
  return (
    <ProtectedRoute required="view:financials">
      <AppShell>
        <FinancialManagementContainer />
      </AppShell>
    </ProtectedRoute>
  )
}
