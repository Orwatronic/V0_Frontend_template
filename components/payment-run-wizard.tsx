"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, ArrowLeft, Banknote, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

const mockPayableInvoices = [
  { id: "INV-002", vendor: "Office Solutions LLC", dueDate: "2024-08-19", amount: 750.5, discount: 15.01 },
  { id: "INV-003", vendor: "Cloud Services Co.", dueDate: "2024-08-21", amount: 3500.0, discount: 70.0 },
  { id: "INV-005", vendor: "Logistics Partners", dueDate: "2024-08-24", amount: 2100.75, discount: 0 },
]

type PayableInvoice = (typeof mockPayableInvoices)[0]

interface PaymentRunWizardProps {
  isOpen: boolean
  onClose: () => void
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const PaymentRunWizard = ({ isOpen, onClose }: PaymentRunWizardProps) => {
  const { t, formatters } = useI18n()
  const { get, post } = useApi()
  const [step, setStep] = useState(1)
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [payableInvoices, setPayableInvoices] = useState<PayableInvoice[]>([])
  const [selectedInvoices, setSelectedInvoices] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ success: boolean; id: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleNext = async () => {
    setErrorMsg(null)
    if (step === 1) {
      setIsLoading(true)
      // CURSOR: API call to GET /api/v1/financials/ap/invoices/payable?dueDate={dueDate}
      try {
        let useMock = true
        try {
          const v = localStorage.getItem("feebee:auth:mock")
          useMock = v ? v === "1" : true
        } catch {}
        if (!useMock) {
          const iso = dueDate?.toISOString().substring(0, 10)
          const res = await get<{ invoices: PayableInvoice[] }>(`/financials/ap/invoices/payable?dueDate=${iso}`)
          setPayableInvoices(((res as any)?.invoices as any) || [])
        } else {
          await new Promise((res) => setTimeout(res, 300))
          setPayableInvoices(mockPayableInvoices)
        }
      } finally {
        setIsLoading(false)
      }
      setSelectedInvoices(mockPayableInvoices.reduce((acc, inv) => ({ ...acc, [inv.id]: true }), {}))
    }
    if (step === 3) {
      const finalInvoiceIds = Object.keys(selectedInvoices).filter((id) => selectedInvoices[id])
      if (finalInvoiceIds.length === 0) {
        setErrorMsg(t('common.validation.required'))
        return
      }
      setIsLoading(true)
      // CURSOR: API call to POST /api/v1/financials/ap/payment-run
      try {
        let useMock = true
        try {
          const v = localStorage.getItem("feebee:auth:mock")
          useMock = v ? v === "1" : true
        } catch {}
        if (!useMock) {
          const out = await post(`/financials/ap/payment-run`, { invoices: finalInvoiceIds })
          setExecutionResult({ success: true, id: (out as any)?.id || `PR-${Date.now()}` })
        } else {
          await new Promise((res) => setTimeout(res, 300))
          setExecutionResult({ success: true, id: `PR-${Date.now()}` })
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (step < 4) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const handleClose = () => {
    setStep(1)
    setPayableInvoices([])
    setSelectedInvoices({})
    setExecutionResult(null)
    onClose()
  }

  const finalSelection = payableInvoices.filter((inv) => selectedInvoices[inv.id])
  const totalAmount = finalSelection.reduce((sum, inv) => sum + (inv.amount - inv.discount), 0)

  const formatCurrency = (amount: number) => formatters.formatCurrency(amount, "USD")

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 p-4">
            <DialogDescription>{t("ppw.step1.description")}</DialogDescription>
            <div>
              <Label htmlFor="dueDate">{t("ppw.step1.dueDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? formatDate(dueDate) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="minAmount">{t("ppw.step1.minAmount")}</Label>
              <Input id="minAmount" type="number" placeholder="e.g., 100.00" />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4 p-4">
            <DialogDescription>{t("ppw.step2.description")}</DialogDescription>
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={Object.values(selectedInvoices).every(Boolean)}
                        onCheckedChange={(checked) =>
                          setSelectedInvoices(
                            payableInvoices.reduce((acc, inv) => ({ ...acc, [inv.id]: !!checked }), {}),
                          )
                        }
                      />
                    </TableHead>
                    <TableHead>{t("common.invoice")}</TableHead>
                    <TableHead>{t("common.vendor")}</TableHead>
                    <TableHead>{t("common.dueDate")}</TableHead>
                    <TableHead className="text-right">{t("common.amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payableInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoices[inv.id]}
                          onCheckedChange={(checked) =>
                            setSelectedInvoices((prev) => ({ ...prev, [inv.id]: !!checked }))
                          }
                        />
                      </TableCell>
                      <TableCell>{inv.id}</TableCell>
                      <TableCell>{inv.vendor}</TableCell>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell className="text-right">{formatCurrency(inv.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4 p-4">
            <DialogDescription>{t("ppw.step3.description")}</DialogDescription>
            {errorMsg && (
              <div role="alert" className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3">
                {errorMsg}
              </div>
            )}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("summary.totalInvoices")}</span>
                  <span className="font-bold text-lg">{finalSelection.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("summary.totalAmount")}</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Export proposal CSV
                      const header = ['Invoice','Vendor','Due Date','Amount']
                      const rows = finalSelection.map(i => [i.id, i.vendor, i.dueDate, String(i.amount)])
                      const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `payment-proposal-${Date.now()}.csv`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Export Proposal (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4 p-4 text-center">
            {executionResult?.success ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">{t("execution.success")}</h3>
                <p className="text-muted-foreground">{t("execution.file")}</p>
                <div className="p-4 bg-secondary rounded-md">
                  <span className="text-sm">{t("execution.id")}: </span>
                  <span className="font-mono font-bold">{executionResult.id}</span>
                </div>
                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      const content = `PAYMENT RUN ${executionResult?.id}`
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `payment-run-${executionResult?.id}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Download Payment File
                  </Button>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h3 className="text-xl font-semibold">Execution Failed</h3>
                <p className="text-muted-foreground">Please check the logs and try again.</p>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const getDialogTitle = () => {
    switch (step) {
      case 1:
        return t("ppw.step1.title")
      case 2:
        return t("ppw.step2.title")
      case 3:
        return t("ppw.step3.title")
      case 4:
        return t("ppw.step4.title")
      default:
        return t("ppw.title")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-6 w-6" />
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-4 text-lg">{t("common.loading")}</span>
          </div>
        ) : (
          renderStepContent()
        )}

        <DialogFooter>
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
            </Button>
          )}
          {step < 3 && (
            <Button onClick={handleNext} disabled={isLoading}>
              {t("common.next")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleNext} disabled={isLoading}>
              {t("common.finish")}
            </Button>
          )}
          {step === 4 ? (
            <Button onClick={handleClose}>{t("common.close")}</Button>
          ) : (
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              {t("common.cancel")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
