"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Order = { id: string; equipment: string; priority: "Low" | "Medium" | "High"; status: "Open" | "InProgress" | "Closed" }

export default function MaintenanceOrderDetail({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<Order["status"]>("Open")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/plant-maintenance/orders/${encodeURIComponent(params.id)}`, { cache: "no-store" })
        .then(r => r.json())
      const item = (data as any)?.data as Order | null
      if (item) {
        setOrder(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!order) return
    setIsSaving(true)
    try {
      // CURSOR: Proxied PATCH /api/v1/maintenance/orders/{id}
      const data = await fetch(`/api/plant-maintenance/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(r => r.json())
      const updated = (data as any)?.data as Order | null
      if (updated) setOrder(updated)
    } finally {
      setIsSaving(false)
    }
  }

  if (!order) {
    return (
      <ProtectedRoute required="view:maintenance">
        <AppShell>
          <div className="mx-auto w-full max-w-3xl p-6">{t("maintenance.loading") || "Loading"}...</div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute required="view:maintenance">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{order.id}</CardTitle>
              <CardDescription>{order.equipment}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t("maintenance.priority") || "Priority"}</div>
                  <div className="font-medium">{order.priority}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("maintenance.status") || "Status"}</div>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="InProgress">InProgress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={isSaving}>{isSaving ? (t("common.saving") || "Saving...") : (t("common.save") || "Save")}</Button>
                <Button variant="secondary" onClick={() => router.back()}>{t("common.back") || "Back"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


