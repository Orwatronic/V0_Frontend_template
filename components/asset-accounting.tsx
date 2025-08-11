"use client"

import { useState } from "react"
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
const [isDepreciationRunning, setIsDepreciationRunning] = useState(false)

const totalAssetValue = mockAssets.reduce(
(sum, asset) => sum + asset.acquisitionCost,
0
)
const totalBookValue = mockAssets.reduce(
(sum, asset) => sum + asset.bookValue,
0
)
const accumulatedDepreciation = totalAssetValue - totalBookValue

const handleRunDepreciation = () => {
// CURSOR: API call to POST /api/v1/financials/assets/depreciation-run
setIsDepreciationRunning(true)
toast({
title: "Depreciation Run Started",
description: "The monthly depreciation calculation is now in progress.",
})
setTimeout(() => {
setIsDepreciationRunning(false)
toast({
  title: "Depreciation Run Complete",
  description: "Asset values have been updated.",
})
}, 3000)
}

return (
<div className="space-y-6">
<Card>
  <CardHeader>
    <CardTitle>Asset Accounting Overview</CardTitle>
    <CardDescription>
      Manage your company's fixed assets and depreciation schedules.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Asset Value
          </CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalAssetValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Original acquisition cost of all assets.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Accumulated Depreciation
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${accumulatedDepreciation.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total depreciation recorded to date.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Net Book Value
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalBookValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Current value of assets on the books.
          </p>
        </CardContent>
      </Card>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>Fixed Asset Register</CardTitle>
      <CardDescription>
        A detailed list of all capitalized assets.
      </CardDescription>
    </div>
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Capitalize New Asset</DialogTitle>
            <DialogDescription>
              Enter the details for the new fixed asset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* CURSOR: Form submission should POST to /api/v1/financials/assets */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right">
                Description
              </Label>
              <Input id="desc" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                Asset Class
              </Label>
              <Input id="class" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Acquisition Cost
              </Label>
              <Input id="cost" type="number" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        onClick={handleRunDepreciation}
        disabled={isDepreciationRunning}
      >
        {isDepreciationRunning
          ? "Calculating..."
          : "Run Monthly Depreciation"}
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Asset Class</TableHead>
          <TableHead className="text-right">Acquisition Cost</TableHead>
          <TableHead className="text-right">Net Book Value</TableHead>
          <TableHead>Acquisition Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* CURSOR: Data should be fetched from GET /api/v1/financials/assets */}
        {mockAssets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell className="font-medium">{asset.id}</TableCell>
            <TableCell>{asset.description}</TableCell>
            <TableCell>{asset.class}</TableCell>
            <TableCell className="text-right">
              ${asset.acquisitionCost.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-semibold">
              ${asset.bookValue.toLocaleString()}
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
