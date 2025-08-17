"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import CrmPageContent from '@/components/crm-page-content'

export default function CRMPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <CrmPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}
