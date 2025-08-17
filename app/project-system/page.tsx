"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Project = { id: string; name: string; status: "Planned" | "Active" | "Closed"; manager: string }

const mockProjects: Project[] = [
  { id: "PRJ-001", name: "ERP Rollout Phase 1", status: "Active", manager: "Alice" },
  { id: "PRJ-002", name: "Warehouse Upgrade", status: "Planned", manager: "Bob" },
  { id: "PRJ-003", name: "Website Revamp", status: "Closed", manager: "Carol" },
]

export default function ProjectSystemPage() {
  const { t } = useI18n()
  const tf = (k: string, fallback: string) => {
    const v = t(k)
    return v === k ? fallback : v
  }
  const { get } = useApi()
  const [rows, setRows] = useState<Project[]>([])
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
        // Always use local Next route (with fallback data when API_BASE_URL is missing)
        // CURSOR: Proxied GET /api/v1/projects via /api/projects
        const data = await fetch("/api/projects", { cache: "no-store" })
          .then(r => r.json())
        setRows(((data as any)?.data as any) || mockProjects)
      } catch {
        setError(t("projects.errors.loadFailed"))
        setRows(mockProjects)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const filtered = rows.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ProtectedRoute required="view:projects">
      <AppShell>
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tf("projects.title", "Project System")}</CardTitle>
                  <CardDescription>{tf("projects.description", "Projects, WBS elements, and progress tracking.")}</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={tf("projects.search", "Search projects...")}
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label={tf("projects.searchAria", "Search projects")}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                  {tf("projects.loading", "Loading")}
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
                      <TableHead>{t("projects.name") || "Name"}</TableHead>
                      <TableHead>{t("projects.status") || "Status"}</TableHead>
                      <TableHead>{t("projects.manager") || "Manager"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          <Link href={`/project-system/${encodeURIComponent(r.id)}`}>{r.id}</Link>
                        </TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>{r.manager}</TableCell>
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
