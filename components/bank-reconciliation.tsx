"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Upload, PlusCircle, GitCompareArrows } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

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
  const [selectedBank, setSelectedBank] = useState<string[]>([])
  const [selectedGl, setSelectedGl] = useState<string[]>([])

  const handleMatch = () => {
    // CURSOR: API call to POST /api/v1/financials/bank-rec/match with { bankIds: selectedBank, glIds: selectedGl }
    toast({
      title: "Transactions Matched",
      description: `${selectedBank.length} bank transaction(s) matched with ${selectedGl.length} GL entr(y)ies.`,
    })
    // In a real app, you'd refetch or filter the lists
    setSelectedBank([])
    setSelectedGl([])
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  const selectedBankTotal = mockBankTransactions
    .filter(t => selectedBank.includes(t.id))
    .reduce((sum, t) => sum + t.amount, 0)
  
  const selectedGlTotal = mockGlEntries
    .filter(t => selectedGl.includes(t.id))
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Bank Statement Reconciliation</CardTitle>
              <CardDescription>Match bank transactions to general ledger entries.</CardDescription>
            </div>
            <div className="flex gap-2">
              {/* CURSOR: This should trigger a file upload to POST /api/v1/financials/bank-rec/upload */}
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Statement</Button>
              <Button onClick={handleMatch} disabled={selectedBank.length === 0 || selectedGl.length === 0}>
                <GitCompareArrows className="mr-2 h-4 w-4" /> Match Selected
              </Button>
              <Button variant="secondary"><PlusCircle className="mr-2 h-4 w-4" /> Create Adjusting Entry</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBankTransactions.map(tx => (
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
                <CardTitle>General Ledger Entries (Cash Account)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGlEntries.map(tx => (
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
              Selected Bank Total: <span className="font-bold text-lg">{formatCurrency(selectedBankTotal)}</span>
            </div>
            <div className="text-sm font-medium">
              Selected GL Total: <span className="font-bold text-lg">{formatCurrency(selectedGlTotal)}</span>
            </div>
            <div className="text-sm font-medium">
              Difference: <span className={`font-bold text-lg ${(selectedBankTotal + selectedGlTotal) !== 0 ? 'text-destructive' : 'text-green-600'}`}>{formatCurrency(selectedBankTotal + selectedGlTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
