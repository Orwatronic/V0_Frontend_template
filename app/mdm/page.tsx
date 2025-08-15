"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import MasterDataManagement from "@/components/master-data-management"

export default function MdmPage() {
  return (
    <ProtectedRoute required="view:mdm">
      <AppShell>
        <MasterDataManagement />
      </AppShell>
    </ProtectedRoute>
  )
}
