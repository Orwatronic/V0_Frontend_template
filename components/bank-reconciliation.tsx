"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Upload, PlusCircle, GitCompareArrows } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

// Mock Data
const mockBankTransactions = [
  { id: "BANK-001", date: "2024-07-25", description: "Deposit - Innovate Corp", amount: 15000.00, type: "credit" },
  { id: "BANK-002", date: "2024-07-26", description: "ACH Payment - Tech Supplies Inc.", amount: -1250.00, type: "debit" },
  { id: "BANK-003", date: "2024-07-28", description: "Wire Transfer - Cloud Services Co.", amount: -3500.00, type: "debit" },
  { id: "BANK-004", date: "2024-07-29", description: "Bank Service Fee", amount: -25.00, type: "debit" },
  { id: "BANK-005", date: "2024-07-30", description: "Interest Earned", amount: 150.75, type: "credit" },
]

// CURSOR: Data should be fetched from GET /api/v1/financials/bank-rec/gl-entries?dateRange=...
const mockGlEntries = [
  { id: "GL-101", date: "2024-07-25", description: "Payment from Innovate Corp CINV-201", amount: 15000.00, type: "debit" },
  { id: "GL-102", date: "2024-07-26", description: "Payment to Tech Supplies Inc. INV-001", amount: -1250.00, type: "credit" },
  { id: "GL-103", date: "2024-07-28", description: "Payment to Cloud Services Co. INV-003", amount: -3500.00, type: "credit" },
  { id: "GL-104", date: "2024-07-29", description: "Customer Payment - Synergy Solutions CINV-202", amount: 8200.50, type: "debit" },
]

export function BankReconciliation() {
  const { toast } = useToast()
  const { t, formatters } = useI18n()
  const { get, post } = useApi()
  const [selectedBank, setSelectedBank] = useState<string[]>([])
  const [selectedGl, setSelectedGl] = useState<string[]>([])
  const [bankTx, setBankTx] = useState<typeof mockBankTransactions>([])
  const [glEntries, setGlEntries] = useState<typeof mockGlEntries>([])
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
          setBankTx(mockBankTransactions)
          setGlEntries(mockGlEntries)
          return
        }
        // CURSOR: API calls
        const bank = await get<{ transactions: typeof mockBankTransactions }>("/financials/bank-rec/bank-transactions")
        const gl = await get<{ entries: typeof mockGlEntries }>("/financials/bank-rec/gl-entries")
        setBankTx(((bank as any)?.transactions as any) || [])
        setGlEntries(((gl as any)?.entries as any) || [])
      } catch (e) {
        setError(t("financial.bankRec.errors.loadFailed"))
        setBankTx(mockBankTransactions)
        setGlEntries(mockGlEntries)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleMatch = async () => {
    let useMock = true
    try {
      const v = localStorage.getItem("feebee:auth:mock")
      useMock = v ? v === "1" : true
    } catch {}
    try {
      if (!useMock) {
        // CURSOR: API call to POST /api/v1/financials/bank-rec/match
        await post("/financials/bank-rec/match", { bankIds: selectedBank, glIds: selectedGl })
      }
      toast({
        title: t("financial.bankRec.toastTitle"),
        description: t("financial.bankRec.toastDescription", { bank: selectedBank.length, gl: selectedGl.length }),
      })
      setSelectedBank([])
      setSelectedGl([])
    } catch {
      toast({ title: t("common.error"), description: t("financial.bankRec.errors.matchFailed"), variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => formatters.formatCurrency(amount, "USD")

  const selectedBankTotal = bankTx
    .filter(t => selectedBank.includes(t.id))
    .reduce((sum, t) => sum + t.amount, 0)
  
  const selectedGlTotal = glEntries
    .filter(t => selectedGl.includes(t.id))
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("financial.bankRec.title")}</CardTitle>
              <CardDescription>{t("financial.bankRec.description")}</CardDescription>
            </div>
            <div className="flex gap-2">
              {/* CURSOR: This should trigger a file upload to POST /api/v1/financials/bank-rec/upload */}
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> {t("financial.bankRec.uploadStatement")}</Button>
              <Button onClick={handleMatch} disabled={selectedBank.length === 0 || selectedGl.length === 0}>
                <GitCompareArrows className="mr-2 h-4 w-4" /> {t("financial.bankRec.matchSelected")}
              </Button>
              <Button variant="secondary"><PlusCircle className="mr-2 h-4 w-4" /> {t("financial.bankRec.createAdjustingEntry")}</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("financial.bankRec.bankTransactions")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                    {t("financial.bankRec.loading")}
                  </div>
                )}
                {error && (
                  <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 mb-3" role="alert">
                    {error}
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>{t("financial.bankRec.date")}</TableHead>
                      <TableHead>{t("financial.bankRec.descriptionCol")}</TableHead>
                      <TableHead className="text-right">{t("financial.bankRec.amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTx.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell><Checkbox checked={selectedBank.includes(tx.id)} onCheckedChange={(checked) => {
                          setSelectedBank(prev => checked ? [...prev, tx.id] : prev.filter(id => id !== tx.id))
                        }} /></TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className={`text-right ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tx.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("financial.bankRec.glEntries")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>{t("financial.bankRec.date")}</TableHead>
                      <TableHead>{t("financial.bankRec.descriptionCol")}</TableHead>
                      <TableHead className="text-right">{t("financial.bankRec.amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {glEntries.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell><Checkbox checked={selectedGl.includes(tx.id)} onCheckedChange={(checked) => {
                          setSelectedGl(prev => checked ? [...prev, tx.id] : prev.filter(id => id !== tx.id))
                        }} /></TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell className={`text-right ${tx.type === 'debit' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tx.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg flex justify-between items-center">
            <div className="text-sm font-medium">
              {t("financial.bankRec.selectedBankTotal")}: <span className="font-bold text-lg">{formatCurrency(selectedBankTotal)}</span>
            </div>
            <div className="text-sm font-medium">
              {t("financial.bankRec.selectedGlTotal")}: <span className="font-bold text-lg">{formatCurrency(selectedGlTotal)}</span>
            </div>
            <div className="text-sm font-medium">
              {t("financial.bankRec.difference")}: <span className={`font-bold text-lg ${(selectedBankTotal + selectedGlTotal) !== 0 ? 'text-destructive' : 'text-green-600'}`}>{formatCurrency(selectedBankTotal + selectedGlTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
