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

type Contact = {
  id: string
  name: string
  role: string
  email: string
  account: string
}

type ContactsResponse = { data: Contact[]; meta?: { total: number; page: number; totalPages: number; limit: number; sortBy: string; sortDir: string; q?: string } }

export default function ContactsPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <ContactsPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function ContactsPageContent() {
  const { t } = useI18n()
  const [rows, setRows] = useState<Contact[]>([])
  const [search, setSearch] = useState("")
  const [visible, setVisible] = useState<{ role: boolean; email: boolean; account: boolean }>({ role: true, email: true, account: true })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Contact>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        params.set('sortBy', String(sortBy))
        params.set('sortDir', sortDir)
        if (search) params.set('q', search)
        const res = await fetch(`/api/crm/contacts?${params.toString()}`, { cache: "no-store" })
        const json: ContactsResponse = await res.json()
        if (!mounted) return
        setRows(json.data || [])
        setTotalPages(json.meta?.totalPages ?? 1)
      } finally {}
    })()
    return () => { mounted = false }
  }, [page, limit, sortBy, sortDir, search])

  const displayed = rows

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t("crm.contacts.title")}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("crm.contacts.title")}</h1>
          <p className="text-muted-foreground">{t("crm.contacts.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("crm.contacts.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t("crm.contacts.searchAria")}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const header = ['Contact ID','Name','Role','Email','Account']
              const rowsCsv = displayed.map(r => [r.id,r.name,r.role,r.email,r.account])
              const csv = [header, ...rowsCsv].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'contacts.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <FileDown className="mr-2 h-4 w-4" /> {t('common.export')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("crm.contacts.listTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead role="button" aria-sort={sortBy==='id' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('id'); setSortDir(sortBy==='id' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.contacts.columns.contactId")}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='name' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('name'); setSortDir(sortBy==='name' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.contacts.columns.name")}</TableHead>
                  {visible.role && (
                    <TableHead role="button" aria-sort={sortBy==='role' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('role'); setSortDir(sortBy==='role' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.contacts.columns.role")}</TableHead>
                  )}
                  {visible.email && (
                    <TableHead role="button" aria-sort={sortBy==='email' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('email'); setSortDir(sortBy==='email' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.contacts.columns.email")}</TableHead>
                  )}
                  {visible.account && (
                    <TableHead role="button" aria-sort={sortBy==='account' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => { setSortBy('account'); setSortDir(sortBy==='account' && sortDir==='asc' ? 'desc' : 'asc') }}>{t("crm.contacts.columns.account")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">{t("crm.contacts.empty")}</TableCell>
                  </TableRow>
                ) : (
                  displayed.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium"><Link href={`/crm/contacts/${r.id}`}>{r.id}</Link></TableCell>
                      <TableCell>{r.name}</TableCell>
                      {visible.role && <TableCell>{r.role}</TableCell>}
                      {visible.email && <TableCell>{r.email}</TableCell>}
                      {visible.account && <TableCell>{r.account}</TableCell>}
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


