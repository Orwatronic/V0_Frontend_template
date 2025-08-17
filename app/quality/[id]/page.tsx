"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useI18n } from "@/contexts/i18n-context"
import { useRouter } from "next/navigation"

type Inspection = { id: string; date: string; status: 'Open' | 'Closed' | 'InProgress'; description: string }

export default function InspectionDetail({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const router = useRouter()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [status, setStatus] = useState<Inspection['status']>('Open')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/quality/inspections`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({}))
      const list = (data as any)?.data as Inspection[] | undefined
      const item = (list || []).find(u => u.id === params.id) || null
      if (item) {
        setInspection(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!inspection) return
    setIsSaving(true)
    try {
      // CURSOR: Proxied PATCH /api/v1/quality/inspections/{id} — local echo not implemented; simulate client update
      setInspection({ ...inspection, status })
    } finally {
      setIsSaving(false)
    }
  }

  if (!inspection) {
    return (
      <ProtectedRoute required="view:quality">
        <AppShell>
          <div className="mx-auto w-full max-w-3xl p-6">{t('quality.loading') || 'Loading'}...</div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute required="view:quality">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{inspection.id}</CardTitle>
              <CardDescription>{inspection.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">{inspection.description}</div>
              <div>
                <div className="text-sm text-muted-foreground">{t('quality.status') || 'Status'}</div>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="InProgress">InProgress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
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


