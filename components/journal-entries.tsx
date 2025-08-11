"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, FileDown, Search, Filter } from 'lucide-react'

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "je.title": "Journal Entries",
      "je.description": "Record and review all financial transactions.",
      "je.entry.number": "Entry #",
      "je.entry.date": "Date",
      "je.entry.description": "Description",
      "je.entry.debit": "Debit",
      "je.entry.credit": "Credit",
      "common.status": "Status",
      "common.search": "Search entries...",
      "common.add": "New Entry",
      "common.export": "Export",
      "common.filter": "Filter",
      "status.Posted": "Posted",
      "status.Draft": "Draft",
      "status.Reversed": "Reversed",
    }[key] || key),
})

const mockEntries = [
  { id: 'JE-001', date: '2024-07-25', description: 'Office supplies purchase', debit: 750.50, credit: 750.50, status: 'Posted' },
  { id: 'JE-002', date: '2024-07-28', description: 'Monthly payroll', debit: 150000.00, credit: 150000.00, status: 'Posted' },
  { id: 'JE-003', date: '2024-08-01', description: 'Sales revenue for July', debit: 250000.00, credit: 250000.00, status: 'Posted' },
  { id: 'JE-004', date: '2024-08-02', description: 'Q3 Marketing expense accrual', debit: 5000.00, credit: 5000.00, status: 'Draft' },
  { id: 'JE-005', date: '2024-08-03', description: 'Correction for JE-001', debit: 750.50, credit: 750.50, status: 'Reversed' },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Posted: "default",
  Draft: "outline",
  Reversed: "destructive",
};

export const JournalEntries = () => {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // CURSOR: API call to GET /api/v1/financials/je
    setEntries(mockEntries)
  }, [])

  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

  const filteredEntries = entries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("je.title")}</CardTitle>
            <CardDescription>{t("je.description")}</CardDescription>
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
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> {t("common.filter")}</Button>
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
                <TableHead>{t("je.entry.number")}</TableHead>
                <TableHead>{t("je.entry.date")}</TableHead>
                <TableHead>{t("je.entry.description")}</TableHead>
                <TableHead className="text-right">{t("je.entry.debit")}</TableHead>
                <TableHead className="text-right">{t("je.entry.credit")}</TableHead>
                <TableHead className="text-center">{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.id}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.debit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.credit)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant[entry.status]}>{t(`status.${entry.status}`)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
