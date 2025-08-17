"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Users, Building2, ClipboardList } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

type OmKpis = {
  headcount: number
  departments: number
  costCenters: number
}

type AuditItem = {
  id: string
  date: string
  description: string
}

const mockKpis: OmKpis = { headcount: 1247, departments: 14, costCenters: 36 }
const mockAudit: AuditItem[] = [
  { id: "AUD-001", date: "2024-08-10", description: "Created cost center CC-110 (North Region)" },
  { id: "AUD-002", date: "2024-08-11", description: "Reassigned manager for CC-040 (HQ Ops)" },
  { id: "AUD-003", date: "2024-08-12", description: "Added org unit ORG-07 (R&D)" },
]

export function OmDashboard() {
  const { t, formatters } = useI18n()
  const { get } = useApi()

  const tf = (k: string, fallback: string) => {
    const v = t(k)
    return v === k ? fallback : v
  }

  const [kpis, setKpis] = useState<OmKpis | null>(null)
  const [audit, setAudit] = useState<AuditItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          setKpis(mockKpis)
          setAudit(mockAudit)
          return
        }
        // CURSOR: GET /api/v1/om/dashboard/kpis
        const k = await get<{ kpis: OmKpis }>("/om/dashboard/kpis")
        // CURSOR: GET /api/v1/om/audit/recent
        const a = await get<{ items: AuditItem[] }>("/om/audit/recent")
        setKpis(((k as any)?.kpis as any) || mockKpis)
        setAudit(((a as any)?.items as any) || mockAudit)
      } catch {
        setError(tf("org.errors.loadFailed", "Failed to load organizational data"))
        setKpis(mockKpis)
        setAudit(mockAudit)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const metricCard = (
    title: string,
    value: string | number,
    Icon: any,
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
          {tf("org.loading", "Loading")}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCard(tf("org.kpi.headcount", "Total Headcount"), kpis?.headcount ?? mockKpis.headcount, Users)}
        {metricCard(tf("org.kpi.departments", "Departments"), kpis?.departments ?? mockKpis.departments, Building2)}
        {metricCard(tf("org.kpi.costCenters", "Cost Centers"), kpis?.costCenters ?? mockKpis.costCenters, TrendingUp)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            {tf("org.audit.title", "Recent Structural Changes")}
          </CardTitle>
          <CardDescription>{tf("org.audit.subtitle", "Summary of recent organizational updates")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{tf("org.audit.date", "Date")}</TableHead>
                  <TableHead>{tf("org.audit.description", "Description")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(audit.length ? audit : mockAudit).map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.id}</TableCell>
                    <TableCell>{i.date}</TableCell>
                    <TableCell>{i.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


