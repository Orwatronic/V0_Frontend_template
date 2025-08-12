"use client"

import ProcurementWorkflow from "@/components/procurement-workflow"
import { MaterialMaster } from "@/components/material-master"
import { WarehouseMap } from "@/components/warehouse-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/contexts/i18n-context"
import { Package, Warehouse, ShoppingCart, BarChart3 } from "lucide-react"

const MaterialsManagement = () => {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("materials.title")}</h1>
          <p className="text-muted-foreground">{t("materials.description")}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("materials.metrics.totalMaterials")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">{t("materials.metrics.activeMaterials")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("materials.metrics.inventoryValue")}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">{t("materials.metrics.totalValue")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("materials.metrics.pendingOrders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">{t("materials.metrics.awaitingDelivery")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("materials.metrics.warehouseUtilization")}</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">{t("materials.metrics.storageCapacity")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("materials.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="master">{t("materials.tabs.masterData")}</TabsTrigger>
          <TabsTrigger value="warehouse">{t("materials.tabs.warehouse")}</TabsTrigger>
          <TabsTrigger value="procurement">{t("materials.tabs.procurement")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("materials.overview.recentActivity")}</CardTitle>
                <CardDescription>{t("materials.overview.recentActivityDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("materials.activity.materialReceived")}</p>
                      <p className="text-sm text-muted-foreground">MAT-001 - Steel Plates</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">500 KG</p>
                      <p className="text-sm text-muted-foreground">{t("materials.activity.timeAgo", { time: "2h" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("materials.activity.stockAdjustment")}</p>
                      <p className="text-sm text-muted-foreground">MAT-002 - ABS Pellets</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-50 KG</p>
                      <p className="text-sm text-muted-foreground">{t("materials.activity.timeAgo", { time: "4h" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("materials.activity.newMaterial")}</p>
                      <p className="text-sm text-muted-foreground">MAT-003 - Microcontroller</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">1000 EA</p>
                      <p className="text-sm text-muted-foreground">{t("materials.activity.timeAgo", { time: "1d" })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("materials.overview.lowStockAlerts")}</CardTitle>
                <CardDescription>{t("materials.overview.lowStockDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cotton T-Shirt</p>
                      <p className="text-sm text-muted-foreground">MAT-004</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">50 EA</p>
                      <p className="text-sm text-muted-foreground">{t("materials.overview.minStock")}: 100 EA</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aluminum Sheets</p>
                      <p className="text-sm text-muted-foreground">MAT-005</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-600">75 PCS</p>
                      <p className="text-sm text-muted-foreground">{t("materials.overview.minStock")}: 50 PCS</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="master">
          <MaterialMaster />
        </TabsContent>

        <TabsContent value="warehouse">
          <WarehouseMap />
        </TabsContent>

        <TabsContent value="procurement">
          <ProcurementWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MaterialsManagement
