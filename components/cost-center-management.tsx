"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"
import { PlusCircle, Search } from "lucide-react"

type CostCenter = { id: string; name: string; manager: string; parentId?: string }

const mockCenters: CostCenter[] = [
  { id: "CC-010", name: "HQ Operations", manager: "Alice" },
  { id: "CC-020", name: "North Region", manager: "Bob", parentId: "CC-010" },
  { id: "CC-110", name: "Sales East", manager: "Carol", parentId: "CC-020" },
]

export function CostCenterManagement() {
  const { t } = useI18n()
  const { get, post } = useApi()
  const tf = (k: string, fallback: string) => (t(k) === k ? fallback : t(k))

  const [centers, setCenters] = useState<CostCenter[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<CostCenter>>({})

  useEffect(() => {
    let useMock = true
    try { const v = localStorage.getItem('feebee:auth:mock'); useMock = v ? v === '1' : true } catch {}
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (useMock) { setCenters(mockCenters); return }
        // CURSOR: GET /api/v1/om/cost-centers
        const data = await get<{ items: CostCenter[] }>("/om/cost-centers")
        setCenters(((data as any)?.items as any) || [])
      } catch {
        setError(tf('org.errors.loadFailed', 'Failed to load cost centers'))
        setCenters(mockCenters)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => centers.filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
  ), [centers, search])

  const submit = async () => {
    if (!form.id || !form.name) return
    let useMock = true
    try { const v = localStorage.getItem('feebee:auth:mock'); useMock = v ? v === '1' : true } catch {}
    try {
      if (!useMock) {
        // CURSOR: POST /api/v1/om/cost-centers
        await post('/om/cost-centers', form)
      }
      setCenters(prev => [...prev, form as CostCenter])
      setOpen(false)
      setForm({})
    } catch {
      setError(tf('org.errors.loadFailed', 'Failed to save cost center'))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{tf('org.costCenters.title','Cost Centers')}</CardTitle>
            <CardDescription>{tf('org.costCenters.description','Manage and budget cost centers')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> {tf('org.costCenters.actions.add', 'Add Cost Center')}
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tf('org.costCenters.search', 'Search cost centers...')}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={tf('org.costCenters.searchAria', 'Search cost centers')}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">{tf('org.costCenters.loading','Loading cost centers')}</div>
        )}
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 mb-3" role="alert">{tf('org.costCenters.errors.loadFailed', error)}</div>
        )}

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{tf('org.name','Name')}</TableHead>
                <TableHead>{tf('org.manager','Manager')}</TableHead>
                <TableHead>{tf('org.parent','Parent')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                    {tf('org.costCenters.empty','No cost centers found')}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.manager}</TableCell>
                    <TableCell>{c.parentId || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tf('org.costCenters.dialog.add','Add Cost Center')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder={tf('org.form.id','ID')} value={form.id || ''} onChange={e=>setForm({...form,id:e.target.value})} />
            <Input placeholder={tf('org.form.name','Name')} value={form.name || ''} onChange={e=>setForm({...form,name:e.target.value})} />
            <Input placeholder={tf('org.form.manager','Manager')} value={form.manager || ''} onChange={e=>setForm({...form,manager:e.target.value})} />
            <Input placeholder={tf('org.form.parent','Parent (optional)')} value={form.parentId || ''} onChange={e=>setForm({...form,parentId:e.target.value})} />
          </div>
          <DialogFooter>
            <Button onClick={submit}>{tf('common.actions.save','Save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}


