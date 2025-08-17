"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, TrendingUp, Clock, PlusCircle, FileDown, Search, Banknote } from "lucide-react"
import { PaymentRunWizard } from "./payment-run-wizard"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

const mockInvoices = [
  {
    id: "INV-001",
    vendor: "Tech Supplies Inc.",
    issueDate: "2024-07-15",
    dueDate: "2024-08-14",
    amount: 1250.0,
    status: "Paid",
  },
  {
    id: "INV-002",
    vendor: "Office Solutions LLC",
    issueDate: "2024-07-20",
    dueDate: "2024-08-19",
    amount: 750.5,
    status: "Open",
  },
  {
    id: "INV-003",
    vendor: "Cloud Services Co.",
    issueDate: "2024-07-22",
    dueDate: "2024-08-21",
    amount: 3500.0,
    status: "Open",
  },
  {
    id: "INV-004",
    vendor: "Marketing Agency",
    issueDate: "2024-06-30",
    dueDate: "2024-07-30",
    amount: 5000.0,
    status: "Overdue",
  },
  {
    id: "INV-005",
    vendor: "Logistics Partners",
    issueDate: "2024-07-25",
    dueDate: "2024-08-24",
    amount: 2100.75,
    status: "Open",
  },
]

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Paid: "default",
  Open: "secondary",
  Overdue: "destructive",
}

export const AccountsPayable = () => {
  const { t, formatters } = useI18n()
  const { get } = useApi()
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
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
        // CURSOR: Proxied GET /api/v1/financials/ap/invoices via /api/financials/ap/invoices
        const data = await fetch("/api/financials/ap/invoices", { cache: "no-store" }).then(r => r.json())
        setInvoices(((data as any)?.data as any) || mockInvoices)
      } catch (e) {
        setError(t("financial.accountsPayable.errors.loadFailed"))
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
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const metrics = {
    total: invoices.reduce((sum, inv) => (inv.status !== "Paid" ? sum + inv.amount : sum), 0),
    overdue: invoices.filter((inv) => inv.status === "Overdue").length,
    upcoming: invoices.filter((inv) => inv.status === "Open").reduce((sum, inv) => sum + inv.amount, 0),
  }

  const metricsCards = [
    { title: t("financial.accountsPayable.metrics.total"), value: formatCurrency(metrics.total), icon: DollarSign },
    {
      title: t("financial.accountsPayable.metrics.overdue"),
      value: `${metrics.overdue} ${t("financial.accountsPayable.invoicesLabel")}`,
      icon: Clock,
    },
    {
      title: t("financial.accountsPayable.metrics.upcoming"),
      value: formatCurrency(metrics.upcoming),
      icon: TrendingUp,
    },
  ]

  return (
    <>
      <PaymentRunWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
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
                <CardTitle>{t("financial.accountsPayable.title")}</CardTitle>
                <CardDescription>{t("financial.accountsPayable.description")}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("financial.accountsPayable.searchPlaceholder")}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={t("financial.accountsPayable.aria.searchLabel")}
                  />
                </div>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> {t("common.export")}
                </Button>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> {t("financial.accountsPayable.addInvoice")}
                </Button>
                <Button variant="default" onClick={() => setIsWizardOpen(true)}>
                  <Banknote className="mr-2 h-4 w-4" /> {t("financial.accountsPayable.createPaymentRun")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                {t("financial.accountsPayable.loading")}
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
                    <TableHead>{t("financial.accountsPayable.columns.invoiceNumber")}</TableHead>
                    <TableHead>{t("financial.accountsPayable.columns.vendor")}</TableHead>
                    <TableHead>{t("financial.accountsPayable.columns.issueDate")}</TableHead>
                    <TableHead>{t("financial.accountsPayable.columns.dueDate")}</TableHead>
                    <TableHead className="text-right">{t("financial.accountsPayable.columns.amount")}</TableHead>
                    <TableHead className="text-center">{t("common.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <Link href={`/financial/ap/${encodeURIComponent(invoice.id)}`}>{invoice.id}</Link>
                      </TableCell>
                      <TableCell>{invoice.vendor}</TableCell>
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
    </>
  )
}
