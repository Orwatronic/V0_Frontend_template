"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Order = {
  id: string
  customer: string
  orderDate: string
  deliveryDate?: string
  amount: number
  status: 'confirmed' | 'inProgress' | 'delivered' | 'invoiced' | 'completed'
}

type OrdersResponse = { data: Order[] }

export default function OrdersPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <OrdersPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function OrdersPageContent() {
  const { t } = useI18n()
  const [rows, setRows] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const res = await fetch('/api/crm/orders', { cache: 'no-store' })
      const json: OrdersResponse = await res.json()
      if (!mounted) return
      setRows(json.data || [])
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q))
  }, [rows, search])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.orders.title')}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t('crm.orders.title')}</h1>
          <p className="text-muted-foreground">{t('crm.orders.subtitle')}</p>
        </div>
        <Input
          placeholder={t('crm.orders.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t('crm.orders.searchAria')}
          className="w-64"
        />
      </div>

      <Card>
        <CardHeader><CardTitle>{t('crm.orders.listTitle')}</CardTitle></CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.orders.columns.orderId')}</TableHead>
                  <TableHead>{t('crm.orders.columns.customer')}</TableHead>
                  <TableHead>{t('crm.orders.columns.orderDate')}</TableHead>
                  <TableHead>{t('crm.orders.columns.deliveryDate')}</TableHead>
                  <TableHead>{t('crm.orders.columns.amount')}</TableHead>
                  <TableHead>{t('crm.orders.columns.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">{t('crm.orders.empty')}</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium"><Link href={`/crm/orders/${r.id}`}>{r.id}</Link></TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{r.orderDate}</TableCell>
                      <TableCell>{r.deliveryDate || '-'}</TableCell>
                      <TableCell>{r.amount}</TableCell>
                      <TableCell>{t(`crm.orders.status.${r.status}`)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


