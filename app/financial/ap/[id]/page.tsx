"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ApInvoice = { id: string; vendor: string; issueDate: string; dueDate: string; amount: number; status: 'Paid' | 'Open' | 'Overdue' }

export default function ApInvoiceDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [inv, setInv] = useState<ApInvoice | null>(null)
  const [status, setStatus] = useState<ApInvoice['status']>('Open')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/financials/ap/invoices/${encodeURIComponent(params.id)}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({}))
      const item = (data as any)?.data as ApInvoice | null
      if (item) {
        setInv(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!inv) return
    setIsSaving(true)
    try {
      const data = await fetch(`/api/financials/ap/invoices/${encodeURIComponent(inv.id)}`, {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status })
      }).then(r => r.json())
      const updated = (data as any)?.data as ApInvoice | null
      if (updated) setInv(updated)
    } finally {
      setIsSaving(false)
    }
  }

  if (!inv) return (
    <ProtectedRoute required="view:financials"><AppShell><div className="p-6">Loading...</div></AppShell></ProtectedRoute>
  )

  return (
    <ProtectedRoute required="view:financials">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{inv.id}</CardTitle>
              <CardDescription>{inv.vendor}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Issue Date</div>
                  <div className="font-medium">{inv.issueDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Due Date</div>
                  <div className="font-medium">{inv.dueDate}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                <Button variant="secondary" onClick={() => router.back()}>Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


