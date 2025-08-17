"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, TrendingUp, Users, PlusCircle, FileDown, Search } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

const mockInvoices = [
  {
    id: "CINV-201",
    customer: "Innovate Corp",
    issueDate: "2024-07-18",
    dueDate: "2024-08-17",
    amount: 15000.0,
    status: "Sent",
  },
  {
    id: "CINV-202",
    customer: "Synergy Solutions",
    issueDate: "2024-07-21",
    dueDate: "2024-08-20",
    amount: 8200.5,
    status: "Paid",
  },
  {
    id: "CINV-203",
    customer: "Apex Industries",
    issueDate: "2024-06-25",
    dueDate: "2024-07-25",
    amount: 22000.0,
    status: "Overdue",
  },
  {
    id: "CINV-204",
    customer: "Quantum Dynamics",
    issueDate: "2024-07-28",
    dueDate: "2024-08-27",
    amount: 12500.0,
    status: "Sent",
  },
  {
    id: "CINV-205",
    customer: "Pioneer Ltd",
    issueDate: "2024-08-01",
    dueDate: "2024-08-31",
    amount: 9800.0,
    status: "Draft",
  },
]

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Paid: "default",
  Sent: "secondary",
  Overdue: "destructive",
  Draft: "outline",
}

export const AccountsReceivable = () => {
  const { t, formatters } = useI18n()
  const { get } = useApi()
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Decide mock vs real based on local flag (feebee:auth:mock). Defaults to true when absent.
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
        // CURSOR: Proxied GET /api/v1/financials/ar/invoices via /api/financials/ar/invoices
        const data = await fetch("/api/financials/ar/invoices", { cache: "no-store" }).then(r => r.json())
        setInvoices(((data as any)?.data as any) || mockInvoices)
      } catch (e) {
        setError(t("financial.accountsReceivable.errors.loadFailed"))
        setInvoices(mockInvoices)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const formatCurrency = (amount: number, currency = "USD") => formatters.formatCurrency(amount, currency)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const metrics = {
    outstanding: invoices.reduce((sum, inv) => (inv.status !== "Paid" ? sum + inv.amount : sum), 0),
    overdue: invoices.reduce((sum, inv) => (inv.status === "Overdue" ? sum + inv.amount : sum), 0),
    avgCollection: 32, // Mock data
  }

  const metricsCards = [
    {
      title: t("financial.accountsReceivable.metrics.outstanding"),
      value: formatCurrency(metrics.outstanding),
      icon: DollarSign,
    },
    {
      title: t("financial.accountsReceivable.metrics.overdue"),
      value: formatCurrency(metrics.overdue),
      icon: TrendingUp,
    },
    {
      title: t("financial.accountsReceivable.metrics.avgCollection"),
      value: `${metrics.avgCollection} ${t("financial.accountsReceivable.daysLabel")}`,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricsCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("financial.accountsReceivable.title")}</CardTitle>
              <CardDescription>{t("financial.accountsReceivable.description")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("financial.accountsReceivable.searchPlaceholder")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={t("financial.accountsReceivable.aria.searchLabel")}
                />
              </div>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" /> {t("common.export")}
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> {t("financial.accountsReceivable.addInvoice")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
              {t("financial.accountsReceivable.loading")}
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
                  <TableHead>{t("financial.accountsReceivable.columns.invoiceNumber")}</TableHead>
                  <TableHead>{t("financial.accountsReceivable.columns.customer")}</TableHead>
                  <TableHead>{t("financial.accountsReceivable.columns.issueDate")}</TableHead>
                  <TableHead>{t("financial.accountsReceivable.columns.dueDate")}</TableHead>
                  <TableHead className="text-right">{t("financial.accountsReceivable.columns.amount")}</TableHead>
                  <TableHead className="text-center">{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <Link href={`/financial/ar/${encodeURIComponent(invoice.id)}`}>{invoice.id}</Link>
                    </TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusVariant[invoice.status]}>
                        {t(`financial.status.${invoice.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
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
