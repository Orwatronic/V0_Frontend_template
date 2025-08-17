"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ContactDetail = {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  account: string
}

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <ContactDetailContent id={params.id} />
      </AppShell>
    </ProtectedRoute>
  )
}

function ContactDetailContent({ id }: { id: string }) {
  const { t } = useI18n()
  const [data, setData] = useState<ContactDetail | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const res = await fetch(`/api/crm/contacts/${id}`, { cache: 'no-store' })
      const json = await res.json()
      if (!mounted) return
      setData(json?.data ?? null)
    })()
    // No dedicated timeline yet; keep hook for future SSE if needed
    return () => { mounted = false }
  }, [id])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.contacts.detail.title')}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('crm.contacts.detail.header', { id })}</h1>
        {data && <p className="text-muted-foreground">{data.name} — {data.role} · {data.email} · {data.account}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('crm.contacts.detail.info')}</CardTitle></CardHeader>
          <CardContent>
            {data ? (
              <ul className="text-sm space-y-1">
                <li><span className="font-medium">{t('crm.contacts.columns.name')}:</span> {data.name}</li>
                <li><span className="font-medium">{t('crm.contacts.columns.role')}:</span> {data.role}</li>
                <li><span className="font-medium">{t('crm.contacts.columns.email')}:</span> {data.email}</li>
                <li><span className="font-medium">{t('crm.contacts.columns.account')}:</span> {data.account}</li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


