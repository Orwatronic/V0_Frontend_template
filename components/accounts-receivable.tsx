"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, TrendingUp, Users, PlusCircle, FileDown, Search } from 'lucide-react'

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "ar.title": "Accounts Receivable",
      "ar.description": "Manage customer invoices and track incoming payments.",
      "ar.metrics.outstanding": "Outstanding AR",
      "ar.metrics.overdue": "Overdue AR",
      "ar.metrics.avgCollection": "Avg. Collection Period",
      "ar.invoices.title": "Customer Invoices",
      "ar.invoice.number": "Invoice #",
      "ar.invoice.customer": "Customer",
      "ar.invoice.issueDate": "Issue Date",
      "ar.invoice.dueDate": "Due Date",
      "ar.invoice.amount": "Amount",
      "common.status": "Status",
      "common.search": "Search invoices...",
      "common.add": "New Invoice",
      "common.export": "Export",
      "status.Paid": "Paid",
      "status.Sent": "Sent",
      "status.Overdue": "Overdue",
      "status.Draft": "Draft",
    }[key] || key),
})

const mockInvoices = [
  { id: 'CINV-201', customer: 'Innovate Corp', issueDate: '2024-07-18', dueDate: '2024-08-17', amount: 15000.00, status: 'Sent' },
  { id: 'CINV-202', customer: 'Synergy Solutions', issueDate: '2024-07-21', dueDate: '2024-08-20', amount: 8200.50, status: 'Paid' },
  { id: 'CINV-203', customer: 'Apex Industries', issueDate: '2024-06-25', dueDate: '2024-07-25', amount: 22000.00, status: 'Overdue' },
  { id: 'CINV-204', customer: 'Quantum Dynamics', issueDate: '2024-07-28', dueDate: '2024-08-27', amount: 12500.00, status: 'Sent' },
  { id: 'CINV-205', customer: 'Pioneer Ltd', issueDate: '2024-08-01', dueDate: '2024-08-31', amount: 9800.00, status: 'Draft' },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Paid: "default",
  Sent: "secondary",
  Overdue: "destructive",
  Draft: "outline",
};

export const AccountsReceivable = () => {
  const { t } = useTranslation()
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // CURSOR: API call to GET /api/v1/financials/ar/invoices
    setInvoices(mockInvoices)
  }, [])

  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const metrics = {
    outstanding: invoices.reduce((sum, inv) => (inv.status !== "Paid" ? sum + inv.amount : sum), 0),
    overdue: invoices.reduce((sum, inv) => (inv.status === "Overdue" ? sum + inv.amount : sum), 0),
    avgCollection: 32, // Mock data
  }

  const metricsCards = [
    { title: t("ar.metrics.outstanding"), value: formatCurrency(metrics.outstanding), icon: DollarSign },
    { title: t("ar.metrics.overdue"), value: formatCurrency(metrics.overdue), icon: TrendingUp },
    { title: t("ar.metrics.avgCollection"), value: `${metrics.avgCollection} Days`, icon: Users },
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
              <CardTitle>{t("ar.title")}</CardTitle>
              <CardDescription>{t("ar.description")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder={t("common.search")} 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> {t("common.export")}</Button>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> {t("common.add")}</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ar.invoice.number")}</TableHead>
                  <TableHead>{t("ar.invoice.customer")}</TableHead>
                  <TableHead>{t("ar.invoice.issueDate")}</TableHead>
                  <TableHead>{t("ar.invoice.dueDate")}</TableHead>
                  <TableHead className="text-right">{t("ar.invoice.amount")}</TableHead>
                  <TableHead className="text-center">{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusVariant[invoice.status]}>{t(`status.${invoice.status}`)}</Badge>
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
