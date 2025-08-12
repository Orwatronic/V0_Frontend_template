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

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "ppw.title": "Payment Run Wizard",
      "ppw.step1.title": "Step 1: Define Parameters",
      "ppw.step1.description": "Set the criteria for the invoices to be paid.",
      "ppw.step1.dueDate": "Due Date Until",
      "ppw.step1.minAmount": "Minimum Amount",
      "ppw.step1.vendorGroup": "Vendor Group",
      "ppw.step2.title": "Step 2: Review & Select Invoices",
      "ppw.step2.description": "Review the proposed invoices and make adjustments.",
      "ppw.step3.title": "Step 3: Confirm Proposal",
      "ppw.step3.description": "Review the final payment proposal before execution.",
      "ppw.step4.title": "Step 4: Execution",
      "ppw.step4.description": "The payment run has been processed.",
      "common.next": "Next",
      "common.back": "Back",
      "common.finish": "Execute Payment Run",
      "common.close": "Close",
      "common.cancel": "Cancel",
      "common.loading": "Loading...",
      "common.invoice": "Invoice",
      "common.vendor": "Vendor",
      "common.dueDate": "Due Date",
      "common.amount": "Amount",
      "common.discount": "Discount",
      "common.netAmount": "Net Amount",
      "summary.totalInvoices": "Total Invoices",
      "summary.totalAmount": "Total Payment Amount",
      "execution.success": "Payment Run Executed Successfully!",
      "execution.id": "Payment Run ID",
      "execution.file": "Payment file has been generated.",
    })[key] || key,
})

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
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [payableInvoices, setPayableInvoices] = useState<PayableInvoice[]>([])
  const [selectedInvoices, setSelectedInvoices] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ success: boolean; id: string } | null>(null)

  const handleNext = async () => {
    if (step === 1) {
      setIsLoading(true)
      // CURSOR: API call to GET /api/v1/financials/ap/invoices/payable?dueDate={dueDate}
      await new Promise((res) => setTimeout(res, 1000)) // Simulate API call
      setPayableInvoices(mockPayableInvoices)
      setSelectedInvoices(mockPayableInvoices.reduce((acc, inv) => ({ ...acc, [inv.id]: true }), {}))
      setIsLoading(false)
    }
    if (step === 3) {
      setIsLoading(true)
      // CURSOR: API call to POST /api/v1/financials/ap/payment-run
      const finalInvoiceIds = Object.keys(selectedInvoices).filter((id) => selectedInvoices[id])
      await new Promise((res) => setTimeout(res, 1500)) // Simulate API call
      setExecutionResult({ success: true, id: `PR-${Date.now()}` })
      setIsLoading(false)
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

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
