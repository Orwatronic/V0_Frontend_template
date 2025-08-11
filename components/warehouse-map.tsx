"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Search, SlidersHorizontal, Maximize, Minimize } from 'lucide-react'

const mockWarehouseLayout = {
  name: "Warehouse A - Main",
  zones: [
    {
      id: "A",
      name: "Zone A - Raw Materials",
      racks: Array.from({ length: 4 }, (_, i) => ({
        id: `R${i + 1}`,
        bins: Array.from({ length: 10 }, (_, j) => ({
          id: `A-R${i + 1}-B${j + 1}`,
          utilization: Math.random() * 100,
          items: Math.floor(Math.random() * 20),
          isFull: Math.random() > 0.9,
          isEmpty: Math.random() < 0.1,
        })),
      })),
    },
    {
      id: "B",
      name: "Zone B - Components",
      racks: Array.from({ length: 3 }, (_, i) => ({
        id: `R${i + 1}`,
        bins: Array.from({ length: 8 }, (_, j) => ({
          id: `B-R${i + 1}-B${j + 1}`,
          utilization: Math.random() * 100,
          items: Math.floor(Math.random() * 15),
          isFull: Math.random() > 0.9,
          isEmpty: Math.random() < 0.1,
        })),
      })),
    },
  ],
}

const getUtilizationColor = (utilization) => {
  if (utilization > 90) return 'bg-red-500 hover:bg-red-600'
  if (utilization > 70) return 'bg-yellow-500 hover:bg-yellow-600'
  if (utilization > 0) return 'bg-green-500 hover:bg-green-600'
  return 'bg-muted hover:bg-muted/80'
}

export function WarehouseMap() {
  const [selectedBin, setSelectedBin] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleBinClick = (bin) => {
    // CURSOR: API call to GET /api/v1/materials/warehouse/bins/{bin.id}
    setSelectedBin(bin)
  }

  return (
    <TooltipProvider>
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 ${isFullScreen ? 'fixed inset-0 bg-background z-50 p-6' : ''}`}>
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-grow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Interactive Warehouse Layout</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
                    {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <CardDescription>{mockWarehouseLayout.name}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="space-y-8">
                {mockWarehouseLayout.zones.map(zone => (
                  <div key={zone.id}>
                    <h3 className="font-semibold mb-4 text-lg">{zone.name}</h3>
                    <div className="flex gap-8 overflow-x-auto pb-4">
                      {zone.racks.map(rack => (
                        <div key={rack.id} className="flex-shrink-0">
                          <p className="text-center text-sm font-medium mb-2">{rack.id}</p>
                          <div className="grid grid-cols-2 gap-1 bg-muted/50 p-1 rounded-md">
                            {rack.bins.map(bin => (
                              <Tooltip key={bin.id}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleBinClick(bin)}
                                    className={`w-12 h-12 rounded-sm transition-all ${getUtilizationColor(bin.utilization)} ${selectedBin?.id === bin.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' : ''}`}
                                  >
                                    <span className="text-xs text-white font-bold mix-blend-difference">{bin.id.split('-').pop()}</span>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Bin: {bin.id}</p>
                                  <p>Utilization: {bin.utilization.toFixed(1)}%</p>
                                  <p>Items: {bin.items}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBin ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-blue-600">{selectedBin.id}</h3>
                  <div>
                    <Label>Utilization</Label>
                    <div className="w-full bg-muted rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${getUtilizationColor(selectedBin.utilization)}`}
                        style={{ width: `${selectedBin.utilization}%` }}
                      />
                    </div>
                    <p className="text-right text-sm font-bold">{selectedBin.utilization.toFixed(1)}%</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Item Count</Label>
                      <p className="text-lg font-semibold">{selectedBin.items}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div>
                        {selectedBin.isFull ? <Badge className="bg-red-500">Full</Badge> : selectedBin.isEmpty ? <Badge variant="outline">Empty</Badge> : <Badge className="bg-green-500">Available</Badge>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contents</h4>
                    <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                      {selectedBin.items > 0 ? (
                        <ul className="space-y-1">
                          {Array.from({ length: selectedBin.items }).slice(0, 5).map((_, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <Package className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>MAT-{(Math.random() * 9000 + 1000).toFixed(0)}</span>
                            </li>
                          ))}
                          {selectedBin.items > 5 && <li className="text-xs text-center text-muted-foreground">...and {selectedBin.items - 5} more</li>}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">Bin is empty</p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full">View Inventory Details</Button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Warehouse className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Select a bin to see details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
