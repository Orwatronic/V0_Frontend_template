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

type Inspection = {
  id: string
  date: string
  status: "Open" | "Closed" | "InProgress"
  description: string
}

const mockInspections: Inspection[] = [
  { id: "INSP-1001", date: "2024-08-01", status: "Open", description: "Incoming goods check – Lot A" },
  { id: "INSP-1002", date: "2024-08-03", status: "InProgress", description: "In-process inspection – Line 2" },
  { id: "INSP-1003", date: "2024-08-05", status: "Closed", description: "Final inspection – Order 789" },
]

export default function QualityPage() {
  const { t } = useI18n()
  const { get } = useApi()
  const [rows, setRows] = useState<Inspection[]>([])
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
          setRows(mockInspections)
          return
        }
        // CURSOR: GET /api/v1/quality/inspections
        const data = await get<{ inspections: Inspection[] }>("/quality/inspections")
        setRows(((data as any)?.inspections as any) || [])
      } catch {
        setError(t("quality.errors.loadFailed"))
        setRows(mockInspections)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const filtered = rows.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ProtectedRoute required="view:quality">
      <AppShell>
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("quality.title",) || "Quality Management"}</CardTitle>
                  <CardDescription>{t("quality.description") || "Inspections, non-conformances, and corrective actions."}</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("quality.search") || "Search inspections..."}
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label={t("quality.searchAria") || "Search inspections"}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                  {t("quality.loading") || "Loading"}
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
                      <TableHead>{t("quality.date") || "Date"}</TableHead>
                      <TableHead>{t("quality.status") || "Status"}</TableHead>
                      <TableHead>{t("quality.descriptionCol") || "Description"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>{r.description}</TableCell>
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
