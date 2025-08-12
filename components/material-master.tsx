"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tree } from "@/components/ui/tree"
import { Search, MoreHorizontal, FileDown, FileUp, PlusCircle, Package } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

// Mock Data - Replace with API calls
// CURSOR: GET /api/v1/mdm/materials/categories
const mockCategories = [
  {
    id: "raw",
    name: "Raw Materials",
    children: [
      { id: "metals", name: "Metals" },
      { id: "plastics", name: "Plastics" },
    ],
  },
  {
    id: "finished",
    name: "Finished Goods",
    children: [
      { id: "electronics", name: "Electronics" },
      { id: "apparel", name: "Apparel" },
    ],
  },
]

// CURSOR: GET /api/v1/mdm/materials?category={categoryId}
const mockMaterials = [
  { id: "M001", name: "Steel Plate", category: "metals", type: "Raw", uom: "KG", status: "active", onHand: 1500 },
  { id: "M002", name: "ABS Pellets", category: "plastics", type: "Raw", uom: "KG", status: "active", onHand: 3000 },
  {
    id: "M003",
    name: "Microcontroller",
    category: "electronics",
    type: "Component",
    uom: "EA",
    status: "active",
    onHand: 10000,
  },
  {
    id: "M004",
    name: "Cotton T-Shirt",
    category: "apparel",
    type: "Finished",
    uom: "EA",
    status: "inactive",
    onHand: 500,
  },
]

export const MaterialMaster = () => {
  const { t } = useI18n()
  const [materials, setMaterials] = useState(mockMaterials)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [materials, searchTerm, selectedCategory])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2" /> {t("materials.masterData.title")}
        </CardTitle>
        <CardDescription>{t("materials.masterData.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-12 gap-6">
          {/* Category Browser */}
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-2">{t("materials.masterData.categories")}</h4>
            <Tree data={mockCategories} onSelect={setSelectedCategory} selectedId={selectedCategory} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("materials.masterData.searchPlaceholder")}
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileUp className="mr-2 h-4 w-4" /> {t("materials.masterData.import")}
                </Button>
                <Button variant="outline" size="sm">
                  <FileDown className="mr-2 h-4 w-4" /> {t("common.export")}
                </Button>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> {t("materials.masterData.addMaterial")}
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("materials.columns.materialId")}</TableHead>
                    <TableHead>{t("materials.columns.name")}</TableHead>
                    <TableHead>{t("materials.columns.type")}</TableHead>
                    <TableHead>{t("materials.columns.baseUom")}</TableHead>
                    <TableHead>{t("materials.columns.status")}</TableHead>
                    <TableHead>{t("materials.columns.onHand")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-mono">{material.id}</TableCell>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t(`materials.types.${material.type.toLowerCase()}`)}</Badge>
                      </TableCell>
                      <TableCell>{material.uom}</TableCell>
                      <TableCell>
                        <Badge variant={material.status === "active" ? "default" : "outline"}>
                          {t(`materials.status.${material.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.onHand.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
