"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type QuoteDetail = {
  id: string
  customer: string
  date: string
  amount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  items: { id: string; description: string; qty: number; price: number }[]
}

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <QuoteDetailContent id={params.id} />
      </AppShell>
    </ProtectedRoute>
  )
}

function QuoteDetailContent({ id }: { id: string }) {
  const { t } = useI18n()
  const [data, setData] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/crm/quotes/${id}`, { cache: 'no-store' })
        const json = await res.json()
        if (!mounted) return
        setData(json?.data ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  const dateFormatter = useMemo(() => {
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }) } catch { return null }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.quotes.detail.title')}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('crm.quotes.detail.header', { id })}</h1>
        {data && (
          <p className="text-muted-foreground">
            {data.customer} · {dateFormatter ? dateFormatter.format(new Date(data.date)) : data.date} · {t(`crm.quotes.status.${data.status}`)}
          </p>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>{t('crm.quotes.detail.items')}</CardTitle></CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
          {!loading && (!data || data.items.length === 0) && (
            <p className="text-sm text-muted-foreground">{t('crm.quotes.detail.noItems')}</p>
          )}
          <ul className="space-y-2">
            {(data?.items ?? []).map((it) => (
              <li key={it.id} className="text-sm">
                {it.description} — {it.qty} × {it.price}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}


