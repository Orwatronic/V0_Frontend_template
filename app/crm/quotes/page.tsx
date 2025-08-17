"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Quote = {
  id: string
  customer: string
  date: string
  amount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
}

type QuotesResponse = { data: Quote[]; meta?: { total: number; page: number; totalPages: number; limit: number; sortBy: string; sortDir: string; q?: string } }

export default function QuotesPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <QuotesPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function QuotesPageContent() {
  const { t } = useI18n()
  const [rows, setRows] = useState<Quote[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Quote>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      params.set('sortBy', String(sortBy))
      params.set('sortDir', sortDir)
      if (search) params.set('q', search)
      const res = await fetch(`/api/crm/quotes?${params.toString()}`, { cache: 'no-store' })
      const json: QuotesResponse = await res.json()
      if (!mounted) return
      setRows(json.data || [])
      setTotalPages(json.meta?.totalPages ?? 1)
    })()
    return () => { mounted = false }
  }, [page, limit, sortBy, sortDir, search])

  const displayed = rows

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.quotes.title')}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t('crm.quotes.title')}</h1>
          <p className="text-muted-foreground">{t('crm.quotes.subtitle')}</p>
        </div>
        <Input
          placeholder={t('crm.quotes.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t('crm.quotes.searchAria')}
          className="w-64"
        />
      </div>

      <Card>
        <CardHeader><CardTitle>{t('crm.quotes.listTitle')}</CardTitle></CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead role="button" aria-sort={sortBy==='id' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('id'); setSortDir(sortBy==='id' && sortDir==='asc' ? 'desc' : 'asc') }}>{t('crm.quotes.columns.quoteId')}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='customer' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('customer'); setSortDir(sortBy==='customer' && sortDir==='asc' ? 'desc' : 'asc') }}>{t('crm.quotes.columns.customer')}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='date' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('date'); setSortDir(sortBy==='date' && sortDir==='asc' ? 'desc' : 'asc') }}>{t('crm.quotes.columns.date')}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='amount' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('amount'); setSortDir(sortBy==='amount' && sortDir==='asc' ? 'desc' : 'asc') }}>{t('crm.quotes.columns.amount')}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='status' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('status'); setSortDir(sortBy==='status' && sortDir==='asc' ? 'desc' : 'asc') }}>{t('crm.quotes.columns.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">{t('crm.quotes.empty')}</TableCell>
                  </TableRow>
                ) : (
                  displayed.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium"><Link href={`/crm/quotes/${r.id}`}>{r.id}</Link></TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.amount}</TableCell>
                      <TableCell>{t(`crm.quotes.status.${r.status}`)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('crm.customerMaster.pagination', { current: page, total: totalPages })}</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                {t('common.back')}
              </Button>
              <Button size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                {t('common.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


