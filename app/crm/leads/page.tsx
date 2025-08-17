"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { usePermissions } from "@/hooks/use-permissions"
import { Search as SearchIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Lead = {
  id: string
  company: string
  owner: string
  status: "new" | "contacted" | "qualified" | "lost"
  createdAt: string
  score: number
}

type LeadsResponse = { data: Lead[]; meta?: { total: number; page: number; totalPages: number; limit: number; sortBy: string; sortDir: string; q?: string } }

export default function LeadsPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <LeadsPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function LeadsPageContent() {
  const { t } = useI18n()
  const { toast } = useToast()
  const { hasPermission } = usePermissions()
  const [leads, setLeads] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState<{ owner: boolean; status: boolean; created: boolean; score: boolean }>(
    { owner: true, status: true, created: true, score: true },
  )
  const [views, setViews] = useState<Record<string, { owner: boolean; status: boolean; created: boolean; score: boolean }>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Lead>("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  
  const updateUrl = (columns?: typeof visible, viewName?: string | null) => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (columns) {
      const enabled = Object.entries(columns)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k)
        .join(',')
      params.set('cols', enabled)
    }
    if (viewName) params.set('view', viewName)
    else params.delete('view')
    const qs = params.toString()
    const next = qs ? `?${qs}` : window.location.pathname
    window.history.replaceState(null, '', next)
  }

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
        const res = await fetch(`/api/crm/leads?${params.toString()}`, { cache: "no-store" })
        const json: LeadsResponse = await res.json()
        if (!mounted) return
        setLeads(json.data || [])
        setTotalPages(json.meta?.totalPages ?? 1)
      } catch {
        // ignore – API route provides fallback
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    // load columns visibility and saved views
    try {
      const stored = localStorage.getItem("crm:leads:columns")
      if (stored) setVisible(JSON.parse(stored))
      const sv = localStorage.getItem("crm:leads:savedViews")
      if (sv) setViews(JSON.parse(sv))
      // URL params: cols=view of columns; view=name of saved view
      const params = new URLSearchParams(window.location.search)
      const cols = params.get('cols')
      const viewName = params.get('view')
      if (cols) {
        const set: Record<string, boolean> = { owner: false, status: false, created: false, score: false }
        cols.split(',').forEach((c) => {
          if (c in set) (set as any)[c] = true
        })
        setVisible((v) => ({ ...v, ...set }))
      }
      if (viewName) {
        const v = JSON.parse(sv || '{}')?.[viewName]
        if (v) setVisible((cur) => ({ ...cur, ...v }))
      }
    } catch {}
    return () => {
      mounted = false
    }
  }, [page, limit, sortBy, sortDir, search])

  const displayed = leads

  const allSelected = displayed.length > 0 && displayed.every((l) => selected[l.id])
  const selectedCount = Object.values(selected).filter(Boolean).length

  const toggleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = { ...selected }
    for (const l of displayed) next[l.id] = checked
    setSelected(next)
  }

  const bulkSetStatus = async (status: Lead["status"]) => {
    if (!hasPermission('view:sales')) return
    const ids = Object.entries(selected)
      .filter(([, v]) => Boolean(v))
      .map(([id]) => id)
    if (ids.length === 0) return
    try {
      await fetch('/api/crm/leads/bulk-status', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      toast({ title: t('crm.leads.bulk.toastTitle'), description: t('crm.leads.bulk.toastDesc', { count: ids.length }) })
    } finally {
      const next = leads.map((l) => (selected[l.id] ? { ...l, status } : l))
      setLeads(next)
    }
  }

  const toggleColumn = (key: keyof typeof visible) => {
    const next = { ...visible, [key]: !visible[key] }
    setVisible(next)
    try {
      localStorage.setItem("crm:leads:columns", JSON.stringify(next))
    } catch {}
    updateUrl(next, null)
  }

  const saveCurrentView = () => {
    const name = typeof window !== 'undefined' ? window.prompt(t('crm.leads.views.promptSave')) : null
    if (!name) return
    const next = { ...views, [name]: visible }
    setViews(next)
    try { localStorage.setItem('crm:leads:savedViews', JSON.stringify(next)) } catch {}
    updateUrl(visible, name)
  }

  const applyView = (name: string) => {
    const v = views[name]
    if (!v) return
    setVisible(v)
    try { localStorage.setItem('crm:leads:columns', JSON.stringify(v)) } catch {}
    updateUrl(v, name)
  }

  const deleteView = (name: string) => {
    const next = { ...views }
    delete next[name]
    setViews(next)
    try { localStorage.setItem('crm:leads:savedViews', JSON.stringify(next)) } catch {}
  }

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })
    } catch {
      return null
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t("crm.leads.title")}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("crm.leads.title")}</h1>
          <p className="text-muted-foreground">{t("crm.leads.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("crm.leads.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t("crm.leads.searchAria")}
              className="pl-8"
            />
          </div>
          <Button variant="outline">{t("crm.leads.importCsv")}</Button>
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
                const res = await fetch('/api/crm/leads/import', { method: 'POST', body: text, headers: { 'content-type': 'text/csv' } })
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
            onClick={() => { window.location.href = '/api/crm/leads/import/template' }}
          >
            {t('common.downloadTemplate')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const header = ['Lead ID','Company','Owner','Status','Created','Score']
              const rows = displayed.map(l => [l.id,l.company,l.owner,l.status,l.createdAt,String(l.score)])
              const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'leads.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            {t("crm.leads.export")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{t("crm.leads.listTitle")}</span>
            {loading ? <Badge variant="secondary">{t("common.loading")}</Badge> : null}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("crm.leads.selectedRows", { selected: selectedCount, total: leads.length })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" disabled={!selectedCount || !hasPermission('view:sales')}>
                  {t("crm.leads.bulk.actions")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("crm.leads.bulk.setStatus")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => bulkSetStatus("new")}>{t("crm.leads.status.new")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkSetStatus("contacted")}>{t("crm.leads.status.contacted")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkSetStatus("qualified")}>{t("crm.leads.status.qualified")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkSetStatus("lost")}>{t("crm.leads.status.lost")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">{t('crm.leads.columnsMenu.title')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('crm.leads.columnsMenu.showHide')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toggleColumn('owner')}>
                  <Checkbox checked={visible.owner} onCheckedChange={() => toggleColumn('owner')} />
                  <span className="ml-2">{t('crm.leads.columns.owner')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleColumn('status')}>
                  <Checkbox checked={visible.status} onCheckedChange={() => toggleColumn('status')} />
                  <span className="ml-2">{t('crm.leads.columns.status')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleColumn('created')}>
                  <Checkbox checked={visible.created} onCheckedChange={() => toggleColumn('created')} />
                  <span className="ml-2">{t('crm.leads.columns.created')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleColumn('score')}>
                  <Checkbox checked={visible.score} onCheckedChange={() => toggleColumn('score')} />
                  <span className="ml-2">{t('crm.leads.columns.score')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={saveCurrentView}>{t('crm.leads.views.saveCurrent')}</DropdownMenuItem>
                {Object.keys(views).length > 0 && <DropdownMenuLabel>{t('crm.leads.views.load')}</DropdownMenuLabel>}
                {Object.keys(views).map((name) => (
                  <DropdownMenuItem key={name} onClick={() => applyView(name)}>
                    {name}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto h-6 px-2"
                      onClick={(e) => { e.stopPropagation(); deleteView(name) }}
                    >
                      {t('crm.leads.views.delete')}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox checked={allSelected} onCheckedChange={(v) => toggleSelectAll(Boolean(v))} />
                  </TableHead>
                  <TableHead role="button" aria-sort={sortBy==='id' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                    setSortBy('id'); setSortDir(sortBy==='id' && sortDir==='asc' ? 'desc' : 'asc')
                  }}>{t("crm.leads.columns.leadId")}</TableHead>
                  <TableHead role="button" aria-sort={sortBy==='company' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                    setSortBy('company'); setSortDir(sortBy==='company' && sortDir==='asc' ? 'desc' : 'asc')
                  }}>{t("crm.leads.columns.company")}</TableHead>
                  {visible.owner && (
                    <TableHead role="button" aria-sort={sortBy==='owner' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                      setSortBy('owner'); setSortDir(sortBy==='owner' && sortDir==='asc' ? 'desc' : 'asc')
                    }}>{t("crm.leads.columns.owner")}</TableHead>
                  )}
                  {visible.status && (
                    <TableHead role="button" aria-sort={sortBy==='status' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                      setSortBy('status'); setSortDir(sortBy==='status' && sortDir==='asc' ? 'desc' : 'asc')
                    }}>{t("crm.leads.columns.status")}</TableHead>
                  )}
                  {visible.created && (
                    <TableHead role="button" aria-sort={sortBy==='createdAt' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                      setSortBy('createdAt'); setSortDir(sortBy==='createdAt' && sortDir==='asc' ? 'desc' : 'asc')
                    }}>{t("crm.leads.columns.created")}</TableHead>
                  )}
                  {visible.score && (
                    <TableHead role="button" aria-sort={sortBy==='score' ? (sortDir==='asc'?'ascending':'descending') : 'none'} onClick={() => {
                      setSortBy('score'); setSortDir(sortBy==='score' && sortDir==='asc' ? 'desc' : 'asc')
                    }}>{t("crm.leads.columns.score")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground">
                      {t("crm.leads.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayed.map((l) => (
                    <TableRow key={l.id} data-testid={`lead-row-${l.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={!!selected[l.id]}
                          onCheckedChange={(v) => setSelected((s) => ({ ...s, [l.id]: Boolean(v) }))}
                          aria-label={`Select ${l.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium"><Link href={`/crm/leads/${l.id}`}>{l.id}</Link></TableCell>
                      <TableCell>{l.company}</TableCell>
                      {visible.owner && <TableCell>{l.owner}</TableCell>}
                      {visible.status && (
                        <TableCell>
                          <Badge variant="outline">{t(`crm.leads.status.${l.status}`)}</Badge>
                        </TableCell>
                      )}
                      {visible.created && (
                        <TableCell>{dateFormatter ? dateFormatter.format(new Date(l.createdAt)) : l.createdAt}</TableCell>
                      )}
                      {visible.score && <TableCell>{l.score}</TableCell>}
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


