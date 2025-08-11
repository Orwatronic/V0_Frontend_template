"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import CustomerPortal from "@/components/customer-portal"

export default function CustomerPortalPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <CustomerPortal />
      </AppShell>
    </ProtectedRoute>
  )
}
