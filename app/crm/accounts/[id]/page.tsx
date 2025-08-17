"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AccountDetail = {
  id: string
  name: string
  type: "enterprise" | "sme" | "startup"
  status: "active" | "pending" | "inactive"
  country: string
  contacts: { id: string; name: string; role: string; email: string }[]
  recentActivity: { id: string; subject: string; at: string }[]
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <AccountDetailContent id={params.id} />
      </AppShell>
    </ProtectedRoute>
  )
}

function AccountDetailContent({ id }: { id: string }) {
  const { t } = useI18n()
  const [data, setData] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/crm/accounts/${id}`, { cache: 'no-store' })
        const json = await res.json()
        if (!mounted) return
        setData(json?.data ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    // Live recent activity via SSE
    try {
      const es = new EventSource('/api/crm/events')
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          if (data?.type === 'activity') {
            const p = data.payload
            const nowIso = new Date().toISOString()
            const subject = p?.kind === 'quotation'
              ? t('crm.activities.stream.quotation', { company: p.company })
              : p?.kind === 'invoice'
              ? t('crm.activities.stream.invoice', { customer: p.customer })
              : p?.kind === 'support'
              ? t('crm.activities.stream.support', { customer: p.customer })
              : null
            if (!subject) return
            setData((prev) => (prev ? { ...prev, recentActivity: [{ id: p?.id ?? `a-${Date.now()}`, subject, at: p?.at ?? nowIso }, ...prev.recentActivity].slice(0, 50) } : prev))
          }
        } catch {}
      }
      return () => { es.close(); mounted = false }
    } catch {}
    return () => { mounted = false }
  }, [id])

  const dateFormatter = useMemo(() => {
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }) } catch { return null }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.accounts.detail.title')}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('crm.accounts.detail.header', { id })}</h1>
        {data && <p className="text-muted-foreground">{data.name} · {t(`crm.accounts.types.${data.type}`)} · {t(`crm.accounts.status.${data.status}`)}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('crm.accounts.detail.contacts')}</CardTitle></CardHeader>
          <CardContent>
            {(data?.contacts ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('crm.accounts.detail.noContacts')}</p>
            ) : (
              <ul className="space-y-2">
                {data?.contacts.map(c => (
                  <li key={c.id} className="text-sm">{c.name} — {c.role} · {c.email}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('crm.accounts.detail.recentActivity')}</CardTitle></CardHeader>
          <CardContent>
            {(data?.recentActivity ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('crm.accounts.detail.noActivity')}</p>
            ) : (
              <ul className="space-y-2">
                {data?.recentActivity.map(a => (
                  <li key={a.id} className="text-sm">
                    {a.subject}
                    <span className="text-muted-foreground"> — {dateFormatter ? dateFormatter.format(new Date(a.at)) : a.at}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


