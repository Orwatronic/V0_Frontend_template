"use client"

import { useState } from "react"
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
  const { t } = useI18n()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 6, 31),
  })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  // In a real app, you would fetch data based on the date range.
  // useEffect(() => {
  //   // CURSOR: API call to GET /api/v1/financials/reports/pnl?from={date.from}&to={date.to}
  //   // CURSOR: API call to GET /api/v1/financials/reports/balance-sheet?date={date.to}
  // }, [date])

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
                    <TableCell className="text-right">{formatCurrency(mockPnlData.revenue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.cogs")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.cogs)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.pnl.grossProfit")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockPnlData.grossProfit)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell>{t("financial.reporting.pnl.operatingExpenses")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.total)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.marketing")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.marketing)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.sales")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.sales)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.pnl.admin")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.admin)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg border-t-2 border-primary">
                    <TableCell>{t("financial.reporting.pnl.netIncome")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockPnlData.netIncome)}</TableCell>
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
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.cash")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.accountsReceivable")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.ar)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.inventory")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.inventory)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.fixedAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.fixed.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.ppe")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.fixed.ppe)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.balanceSheet.totalAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("financial.reporting.balanceSheet.liabilities")}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.currentLiabilities")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.accountsPayable")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.current.ap)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("financial.reporting.balanceSheet.longTermLiabilities")}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(mockBsData.liabilities.longTerm.total)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("financial.reporting.balanceSheet.longTermDebt")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.longTerm.debt)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("financial.reporting.balanceSheet.equity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.equity.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold border-t">
                    <TableCell>{t("financial.reporting.balanceSheet.totalLiabilitiesEquity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.totalLiabilitiesEquity)}</TableCell>
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
