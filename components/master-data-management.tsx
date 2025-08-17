"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database, Plus, Search, Download, Upload, Edit, Eye, MoreHorizontal, Users, Package, Building, UserCheck, DollarSign, ArrowUpRight, ArrowDownRight, ChevronRight, Filter, RefreshCw, CheckCircle, Clock, AlertCircle, FileText, Globe, Settings, History, Workflow } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CustomerMaster } from "@/components/customer-master"
import { MaterialMaster } from "@/components/material-master"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/contexts/i18n-context"

const MasterDataManagement = () => {
const router = useRouter()
const { t } = useI18n()

return (
<div className="min-h-screen bg-background text-foreground">
<div className="p-8 space-y-8">
  {/* Module Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <Database className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{t("modules.mdm.title")}</h1>
        <p className="text-muted-foreground">{t("modules.mdm.description")}</p>
      </div>
    </div>
  </div>

  <Tabs defaultValue="customer" className="w-full">
    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
      <TabsTrigger value="customer">
        <Users className="mr-2 h-4 w-4" />
        {t("mdm.domains.customer")}
      </TabsTrigger>
      <TabsTrigger value="material">
        <Package className="mr-2 h-4 w-4" />
        {t("mdm.domains.material")}
      </TabsTrigger>
    </TabsList>
    <TabsContent value="customer" className="mt-6">
      <CustomerMaster />
    </TabsContent>
    <TabsContent value="material" className="mt-6">
      <MaterialMaster />
    </TabsContent>
  </Tabs>
</div>
</div>
)
}

export default MasterDataManagement
