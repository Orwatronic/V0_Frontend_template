"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OrderDetail = {
  id: string
  customer: string
  orderDate: string
  deliveryDate?: string
  amount: number
  status: 'confirmed' | 'inProgress' | 'delivered' | 'invoiced' | 'completed'
  items: { id: string; description: string; qty: number; price: number }[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <OrderDetailContent id={params.id} />
      </AppShell>
    </ProtectedRoute>
  )
}

function OrderDetailContent({ id }: { id: string }) {
  const { t } = useI18n()
  const [data, setData] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/crm/orders/${id}`, { cache: 'no-store' })
        const json = await res.json()
        if (!mounted) return
        setData(json?.data ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  const date = useMemo(() => {
    try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }) } catch { return null }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.orders.detail.title')}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('crm.orders.detail.header', { id })}</h1>
        {data && (
          <p className="text-muted-foreground">
            {data.customer} · {date ? date.format(new Date(data.orderDate)) : data.orderDate} · {t(`crm.orders.status.${data.status}`)}
          </p>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>{t('crm.orders.detail.items')}</CardTitle></CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
          {!loading && (!data || data.items.length === 0) && (
            <p className="text-sm text-muted-foreground">{t('crm.orders.detail.noItems')}</p>
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


