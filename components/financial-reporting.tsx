"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

// Mock Data
const mockPnlData = {
  revenue: 550000,
  cogs: 210000,
  grossProfit: 340000,
  opEx: {
    total: 180000,
    marketing: 60000,
    sales: 75000,
    admin: 45000,
  },
  netIncome: 160000,
}

const mockBsData = {
  assets: {
    current: {
      total: 350000,
      cash: 150000,
      ar: 120000,
      inventory: 80000,
    },
    fixed: {
      total: 650000,
      ppe: 650000,
    },
    total: 1000000,
  },
  liabilities: {
    current: {
      total: 180000,
      ap: 180000,
    },
    longTerm: {
      total: 320000,
      debt: 320000,
    },
    total: 500000,
  },
  equity: {
    total: 500000,
  },
  totalLiabilitiesEquity: 1000000,
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export const FinancialReporting = () => {
  const { t, formatters } = useI18n()
  const { get } = useApi()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 6, 31),
  })
  const [pnl, setPnl] = useState<typeof mockPnlData | null>(null)
  const [bs, setBs] = useState<typeof mockBsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (amount: number) => formatters.formatCurrency(amount, "USD")

  // In a real app, fetch data based on date range
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
          setPnl(mockPnlData)
          setBs(mockBsData)
          return
        }
        const from = date?.from?.toISOString().substring(0, 10)
        const to = date?.to?.toISOString().substring(0, 10)
        // CURSOR: API calls
        const pnlRes = await get<{ data: typeof mockPnlData }>(`/financials/reports/pnl?from=${from}&to=${to}`)
        const bsRes = await get<{ data: typeof mockBsData }>(`/financials/reports/balance-sheet?date=${to}`)
        setPnl(((pnlRes as any)?.data as any) || mockPnlData)
        setBs(((bsRes as any)?.data as any) || mockBsData)
      } catch (e) {
        setError(t("financial.reporting.errors.loadFailed"))
        setPnl(mockPnlData)
        setBs(mockBsData)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [date?.from, date?.to])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{t("financial.reporting.title")}</CardTitle>
            <CardDescription>{t("financial.reporting.description")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {formatDate(date.from)} - {formatDate(date.to)}
                      </>
                    ) : (
                      formatDate(date.from)
                    )
                  ) : (
                    <span>{t("financial.reporting.dateRange")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("financial.reporting.export")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
            {t("financial.reporting.loading")}
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 mb-3" role="alert">
            {error}
          </div>
        )}
        <Tabs defaultValue="pnl">
          <TabsList>
            <TabsTrigger value="pnl">{t("financial.reporting.tabs.pnl")}</TabsTrigger>
            <TabsTrigger value="bs">{t("financial.reporting.tabs.balanceSheet")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pnl" className="pt-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">{t("financial.reporting.accountColumn")}</TableHead>
                    <TableHead className="text-right">{t("financial.reporting.amountColumn")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold">
                    <TableCell>{t("financial.reporting.pnl.revenue")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((pnl || mockPnlData).revenue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.cogs")}</TableCell>
                    <TableCell className="text-right">({formatCurrency((pnl || mockPnlData).cogs)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.pnl.grossProfit")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((pnl || mockPnlData).grossProfit)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell>{t("financial.reporting.pnl.operatingExpenses")}</TableCell>
                    <TableCell className="text-right">({formatCurrency((pnl || mockPnlData).opEx.total)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.marketing")}</TableCell>
                    <TableCell className="text-right">({formatCurrency((pnl || mockPnlData).opEx.marketing)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.sales")}</TableCell>
                    <TableCell className="text-right">({formatCurrency((pnl || mockPnlData).opEx.sales)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.admin")}</TableCell>
                    <TableCell className="text-right">({formatCurrency((pnl || mockPnlData).opEx.admin)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg border-t-2 border-primary">
                    <TableCell>{t("financial.reporting.pnl.netIncome")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((pnl || mockPnlData).netIncome)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="bs" className="pt-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">{t("financial.reporting.accountColumn")}</TableHead>
                    <TableHead className="text-right">{t("financial.reporting.amountColumn")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("financial.reporting.balanceSheet.assets")}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.currentAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.cash")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.current.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.accountsReceivable")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.current.ar)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.inventory")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.current.inventory)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.fixedAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.fixed.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.ppe")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.fixed.ppe)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.balanceSheet.totalAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).assets.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("financial.reporting.balanceSheet.liabilities")}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.currentLiabilities")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).liabilities.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.accountsPayable")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).liabilities.current.ap)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.longTermLiabilities")}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency((bs || mockBsData).liabilities.longTerm.total)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.longTermDebt")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).liabilities.longTerm.debt)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("financial.reporting.balanceSheet.equity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).equity.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.balanceSheet.totalLiabilitiesEquity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency((bs || mockBsData).totalLiabilitiesEquity)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
