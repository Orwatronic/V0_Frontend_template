"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

export default function WarehouseAdminPage() {
  const [schemaText, setSchemaText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await fetch('/api/materials/warehouse/schema', { cache: 'no-store' }).then(r => r.json())
        setSchemaText(JSON.stringify((data as any)?.data ?? {}, null, 2))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const save = async () => {
    setIsLoading(true)
    setMessage(null)
    try {
      const parsed = JSON.parse(schemaText)
      const data = await fetch('/api/materials/warehouse/schema', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: parsed }),
      }).then(r => r.json())
      setSchemaText(JSON.stringify((data as any)?.data ?? {}, null, 2))
      setMessage('Saved (in-memory for fallback).')
    } catch (e: any) {
      setMessage(`Save failed: ${e?.message ?? 'Invalid JSON or network error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute required="view:materials">
      <AppShell>
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Configuration</CardTitle>
              <CardDescription>Define warehouses, zones, racks, and bins. JSON schema is used for flexibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {message && <div className="rounded-md border p-2 text-sm">{message}</div>}
              <Textarea className="min-h-[400px] font-mono" value={schemaText} onChange={(e) => setSchemaText(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={save} disabled={isLoading}>Save</Button>
                <Button variant="secondary" onClick={() => location.reload()} disabled={isLoading}>Reload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


