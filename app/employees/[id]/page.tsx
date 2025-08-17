"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Employee = {
  id: string
  employeeId: string
  name: string
  position: string
  department: string
  manager: string
  location: string
  hireDate: string
  salary: number
  status: "Active" | "Inactive"
  email: string
  phone: string
  performance: number
  avatar?: string
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [status, setStatus] = useState<Employee["status"]>("Active")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/hcm/employees/${encodeURIComponent(params.id)}`, { cache: "no-store" })
        .then(r => r.json()).catch(() => ({}))
      const item = (data as any)?.data as Employee | null
      if (item) {
        setEmployee(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!employee) return
    setIsSaving(true)
    try {
      const data = await fetch(`/api/hcm/employees/${encodeURIComponent(employee.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(r => r.json())
      const updated = (data as any)?.data as Employee | null
      if (updated) setEmployee(updated)
    } finally {
      setIsSaving(false)
    }
  }

  if (!employee) {
    return (
      <ProtectedRoute required="view:hcm">
        <AppShell>
          <div className="mx-auto w-full max-w-3xl p-6">Loading...</div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute required="view:hcm">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{employee.name}</CardTitle>
              <CardDescription>{employee.position} • {employee.employeeId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-medium">{employee.department}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Manager</div>
                  <div className="font-medium">{employee.manager}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hire Date</div>
                  <div className="font-medium">{new Date(employee.hireDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{employee.location}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
                <Button variant="secondary" onClick={() => router.back()}>Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


