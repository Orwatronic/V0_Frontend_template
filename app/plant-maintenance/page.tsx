"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Order = { id: string; equipment: string; priority: "Low" | "Medium" | "High"; status: "Open" | "InProgress" | "Closed" }

const mockOrders: Order[] = [
  { id: "MO-7001", equipment: "Boiler #2", priority: "High", status: "Open" },
  { id: "MO-7002", equipment: "Conveyor A", priority: "Medium", status: "InProgress" },
  { id: "MO-7003", equipment: "Compressor Z", priority: "Low", status: "Closed" },
]

export default function PlantMaintenancePage() {
  const { t } = useI18n()
  const { get } = useApi()
  const [rows, setRows] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let useMock = true
    try {
      const v = localStorage.getItem("feebee:auth:mock")
      useMock = v ? v === "1" : true
    } catch {}

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (useMock) {
          setRows(mockOrders)
          return
        }
        // CURSOR: GET /api/v1/maintenance/orders
        const data = await get<{ orders: Order[] }>("/maintenance/orders")
        setRows(((data as any)?.orders as any) || [])
      } catch {
        setError(t("maintenance.errors.loadFailed"))
        setRows(mockOrders)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const filtered = rows.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) || r.equipment.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ProtectedRoute required="view:maintenance">
      <AppShell>
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("maintenance.title") || "Plant Maintenance"}</CardTitle>
                  <CardDescription>{t("maintenance.description") || "Manage assets, maintenance orders, and schedules."}</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("maintenance.search") || "Search orders..."}
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label={t("maintenance.searchAria") || "Search maintenance orders"}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                  {t("maintenance.loading") || "Loading"}
                </div>
              )}
              {error && (
                <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 mb-3" role="alert">
                  {error}
                </div>
              )}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{t("maintenance.equipment") || "Equipment"}</TableHead>
                      <TableHead>{t("maintenance.priority") || "Priority"}</TableHead>
                      <TableHead>{t("maintenance.status") || "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.equipment}</TableCell>
                        <TableCell>{r.priority}</TableCell>
                        <TableCell>{r.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
