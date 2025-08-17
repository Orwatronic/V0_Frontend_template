"use client"

import { useState, useEffect } from "react"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Building, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

type Asset = {
id: string
description: string
class: string
acquisitionDate: string
acquisitionCost: number
usefulLife: number // in years
depreciationMethod: "Straight-Line" | "Double-Declining"
bookValue: number
}

const mockAssets: Asset[] = [
{
id: "ASSET-001",
description: "Head Office Building",
class: "Buildings",
acquisitionDate: "2018-01-15",
acquisitionCost: 5000000,
usefulLife: 40,
depreciationMethod: "Straight-Line",
bookValue: 4187500,
},
{
id: "ASSET-002",
description: "Delivery Truck Fleet (5 units)",
class: "Vehicles",
acquisitionDate: "2022-03-10",
acquisitionCost: 350000,
usefulLife: 7,
depreciationMethod: "Straight-Line",
bookValue: 225000,
},
{
id: "ASSET-003",
description: "Manufacturing CNC Machine",
class: "Machinery",
acquisitionDate: "2021-07-20",
acquisitionCost: 1200000,
usefulLife: 10,
depreciationMethod: "Double-Declining",
bookValue: 768000,
},
{
id: "ASSET-004",
description: "Server Infrastructure",
class: "IT Equipment",
acquisitionDate: "2023-01-05",
acquisitionCost: 250000,
usefulLife: 5,
depreciationMethod: "Straight-Line",
bookValue: 200000,
},
]

export function AssetAccounting() {
const { toast } = useToast()
const { t, formatters } = useI18n()
const { get, post } = useApi()
const [isDepreciationRunning, setIsDepreciationRunning] = useState(false)
const [assets, setAssets] = useState<Asset[]>([])
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
        setAssets(mockAssets)
        return
      }
      // CURSOR: GET /api/v1/financials/assets
      const data = await get<{ assets: Asset[] }>("/financials/assets")
      setAssets(((data as any)?.assets as Asset[]) || [])
    } catch (e) {
      setError(t("financial.assets.errors.loadFailed"))
      setAssets(mockAssets)
    } finally {
      setIsLoading(false)
    }
  }

  load()
}, [])

const totalAssetValue = assets.reduce(
(sum, asset) => sum + asset.acquisitionCost,
0
)
const totalBookValue = assets.reduce(
(sum, asset) => sum + asset.bookValue,
0
)
const accumulatedDepreciation = totalAssetValue - totalBookValue

const handleRunDepreciation = async () => {
// CURSOR: API call to POST /api/v1/financials/assets/depreciation-run
setIsDepreciationRunning(true)
  try {
    let useMock = true
    try {
      const v = localStorage.getItem("feebee:auth:mock")
      useMock = v ? v === "1" : true
    } catch {}
    if (!useMock) {
      await post("/financials/assets/depreciation-run", {})
    }
    toast({
      title: t("financial.assets.toast.startTitle",),
      description: t("financial.assets.toast.startDesc"),
    })
    setTimeout(() => {
      setIsDepreciationRunning(false)
      toast({
        title: t("financial.assets.toast.completeTitle"),
        description: t("financial.assets.toast.completeDesc"),
      })
    }, 3000)
  } catch {
    setIsDepreciationRunning(false)
    toast({ title: t("common.error"), description: t("financial.assets.errors.runFailed"), variant: "destructive" })
  }
}

return (
<div className="space-y-6">
<Card>
  <CardHeader>
    <CardTitle>{t("financial.assets.title")}</CardTitle>
    <CardDescription>
      {t("financial.assets.description")}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("financial.assets.metrics.totalAssetValue")}
          </CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatters.formatCurrency(totalAssetValue, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("financial.assets.metrics.totalAssetValueDesc")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("financial.assets.metrics.accumDepreciation")}
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatters.formatCurrency(accumulatedDepreciation, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("financial.assets.metrics.accumDepreciationDesc")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("financial.assets.metrics.netBookValue")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatters.formatCurrency(totalBookValue, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("financial.assets.metrics.netBookValueDesc")}
          </p>
        </CardContent>
      </Card>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>{t("financial.assets.register.title")}</CardTitle>
      <CardDescription>
        {t("financial.assets.register.description")}
      </CardDescription>
    </div>
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> {t("financial.assets.actions.addAsset")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("financial.assets.dialog.addTitle")}</DialogTitle>
            <DialogDescription>
              {t("financial.assets.dialog.addDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* CURSOR: Form submission should POST to /api/v1/financials/assets */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right">
                {t("financial.assets.form.description")}
              </Label>
              <Input id="desc" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                {t("financial.assets.form.assetClass")}
              </Label>
              <Input id="class" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                {t("financial.assets.form.acquisitionCost")}
              </Label>
              <Input id="cost" type="number" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("financial.assets.actions.saveAsset")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        onClick={handleRunDepreciation}
        disabled={isDepreciationRunning}
      >
        {isDepreciationRunning
          ? "Calculating..."
          : t("financial.assets.actions.runMonthly")}
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    {isLoading && (
      <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
        {t("financial.assets.loading")}
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
          <TableHead>{t("financial.assets.table.assetId")}</TableHead>
          <TableHead>{t("financial.assets.table.description")}</TableHead>
          <TableHead>{t("financial.assets.table.assetClass")}</TableHead>
          <TableHead className="text-right">{t("financial.assets.table.acquisitionCost")}</TableHead>
          <TableHead className="text-right">{t("financial.assets.table.netBookValue")}</TableHead>
          <TableHead>{t("financial.assets.table.acquisitionDate")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* CURSOR: Data should be fetched from GET /api/v1/financials/assets */}
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell className="font-medium">{asset.id}</TableCell>
            <TableCell>{asset.description}</TableCell>
            <TableCell>{asset.class}</TableCell>
            <TableCell className="text-right">
              {formatters.formatCurrency(asset.acquisitionCost, "USD")}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatters.formatCurrency(asset.bookValue, "USD")}
            </TableCell>
            <TableCell>{asset.acquisitionDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
</div>
)
}
