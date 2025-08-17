"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search as SearchIcon, FileDown } from "lucide-react"
import Link from "next/link"

type Account = {
  id: string
  name: string
  type: "enterprise" | "sme" | "startup"
  status: "active" | "pending" | "inactive"
  country: string
}

type AccountsResponse = { data: Account[]; meta?: { total: number; page: number; totalPages: number; limit: number; sortBy: string; sortDir: string; q?: string } }

export default function AccountsPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <AccountsPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function AccountsPageContent() {
  const { t } = useI18n()
  const [rows, setRows] = useState<Account[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState<{ type: boolean; status: boolean; country: boolean }>({ type: true, status: true, country: true })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Account>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        params.set('sortBy', String(sortBy))
        params.set('sortDir', sortDir)
        if (search) params.set('q', search)
        const res = await fetch(`/api/crm/accounts?${params.toString()}`, { cache: "no-store" })
        const json: AccountsResponse = await res.json()
        if (!mounted) return
        setRows(json.data || [])
        setTotalPages(json.meta?.totalPages ?? 1)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [page, limit, sortBy, sortDir, search])

  const displayed = rows

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t("crm.accounts.title")}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("crm.accounts.title")}</h1>
          <p className="text-muted-foreground">{t("crm.accounts.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("crm.accounts.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t("crm.accounts.searchAria")}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const header = ['Account ID','Name','Type','Status','Country']
              const rowsCsv = displayed.map(r => [r.id,r.name,t(`crm.accounts.types.${r.type}`),t(`crm.accounts.status.${r.status}`),r.country])
              const csv = [header, ...rowsCsv].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'accounts.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <FileDown className="mr-2 h-4 w-4" /> {t('common.export')}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.csv,text/csv'
              input.onchange = async () => {
                const file = input.files?.[0]
                if (!file) return
                const text = await file.text()
                const res = await fetch('/api/crm/accounts/import', { method: 'POST', body: text, headers: { 'content-type': 'text/csv' } })
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}))
                  alert(`Import failed: ${err?.errors?.[0]?.message ?? res.status}`)
                  return
                }
                const out = await res.json()
                alert(`Imported ${out.imported} rows`)
              }
              input.click()
            }}
          >
            {t('common.import')}
          </Button>
          <Button
            variant="outline"
            onClick={() => { window.location.href = '/api/crm/accounts/import/template' }}
          >
            {t('common.downloadTemplate')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("crm.accounts.listTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead role="button" aria-sort={sortBy==='id' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('id'); setSortDir(sortBy==='id' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.accounts.columns.accountId")}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='name' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('name'); setSortDir(sortBy==='name' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.accounts.columns.name")}</TableHead>
                  {visible.type && (
                    <TableHead role="button" aria-sort={sortBy==='type' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('type'); setSortDir(sortBy==='type' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.accounts.columns.type")}</TableHead>
                  )}
                  {visible.status && (
                    <TableHead role="button" aria-sort={sortBy==='status' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('status'); setSortDir(sortBy==='status' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.accounts.columns.status")}</TableHead>
                  )}
                  {visible.country && (
                    <TableHead role="button" aria-sort={sortBy==='country' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('country'); setSortDir(sortBy==='country' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.accounts.columns.country")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      {t("crm.accounts.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayed.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium"><Link href={`/crm/accounts/${r.id}`}>{r.id}</Link></TableCell>
                      <TableCell>{r.name}</TableCell>
                      {visible.type && <TableCell>{t(`crm.accounts.types.${r.type}`)}</TableCell>}
                      {visible.status && <TableCell>{t(`crm.accounts.status.${r.status}`)}</TableCell>}
                      {visible.country && <TableCell>{r.country}</TableCell>}
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


