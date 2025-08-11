"use client"

import React, { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// CURSOR: API call to GET /api/v1/analytics/sales-by-region?range={dateRange}
const mockSalesData = [
  { name: "United States", coordinates: [-95.7129, 37.0902], sales: 5400000, color: "#a8ddb5" },
  { name: "Germany", coordinates: [10.4515, 51.1657], sales: 2100000, color: "#43a2ca" },
  { name: "Brazil", coordinates: [-51.9253, -14.2350], sales: 1500000, color: "#7bccc4" },
  { name: "India", coordinates: [78.9629, 20.5937], sales: 950000, color: "#ccebc5" },
  { name: "Australia", coordinates: [133.7751, -25.2744], sales: 1200000, color: "#a8ddb5" },
  { name: "Japan", coordinates: [138.2529, 36.2048], sales: 1800000, color: "#7bccc4" },
  { name: "South Africa", coordinates: [22.9375, -30.5595], sales: 450000, color: "#f0f9e8" },
];

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export function SalesByRegionMap() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sales by Region</CardTitle>
        <CardDescription>A global overview of sales performance.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <TooltipProvider>
          <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%" }}>
            <ZoomableGroup center={[0, 0]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E9EAEA"
                      stroke="#D6D6DA"
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#D6D6DA" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {mockSalesData.map(({ name, coordinates, sales, color }) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <Marker coordinates={coordinates as [number, number]}>
                      <circle r={Math.log(sales / 100000) * 3} fill={color} stroke="#fff" strokeWidth={1} className="cursor-pointer hover:opacity-80" />
                    </Marker>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{name}</p>
                    <p>Sales: ${sales.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
