"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { useRouter } from "next/navigation"

type OrgUnit = { id: string; name: string; costCenters: number; status: 'Active' | 'Inactive' }

export default function OrgUnitDetail({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const router = useRouter()
  const [unit, setUnit] = useState<OrgUnit | null>(null)
  const [status, setStatus] = useState<OrgUnit['status']>('Active')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/org/units`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({}))
      const list = (data as any)?.data as OrgUnit[] | undefined
      const item = (list || []).find(u => u.id === params.id) || null
      if (item) {
        setUnit(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!unit) return
    setIsSaving(true)
    try {
      // CURSOR: Proxied PATCH /api/v1/org/units/{id} — local echo not implemented; simulate client update
      setUnit({ ...unit, status })
    } finally {
      setIsSaving(false)
    }
  }

  if (!unit) {
    return (
      <ProtectedRoute required="admin:settings">
        <AppShell>
          <div className="mx-auto w-full max-w-3xl p-6">{t('org.loading') || 'Loading'}...</div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute required="admin:settings">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{unit.name}</CardTitle>
              <CardDescription>{unit.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t('org.costCenters') || 'Cost Centers'}</div>
                  <div className="font-medium">{unit.costCenters}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('org.status') || 'Status'}</div>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={isSaving}>{isSaving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}</Button>
                <Button variant="secondary" onClick={() => router.back()}>{t('common.back') || 'Back'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


