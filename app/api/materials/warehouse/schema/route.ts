import { NextResponse } from 'next/server'

type Bin = { id: string; utilization: number; items: number; isFull?: boolean; isEmpty?: boolean }
type Rack = { id: string; bins: Bin[] }
type Zone = { id: string; name: string; racks: Rack[] }
type WarehouseSchema = { name: string; zones: Zone[] }

const fallbackSchema: WarehouseSchema = {
  name: 'Warehouse A - Main',
  zones: [
    {
      id: 'A',
      name: 'Zone A - Raw Materials',
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
      id: 'B',
      name: 'Zone B - Components',
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

export async function GET() {
  // CURSOR: API call to GET /api/v1/materials/warehouse/schema
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackSchema })
  }
  try {
    const url = new URL('/api/v1/materials/warehouse/schema', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackSchema })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackSchema })
  }
}

export async function PATCH(req: Request) {
  // CURSOR: API call to PATCH /api/v1/materials/warehouse/schema
  const base = process.env.API_BASE_URL
  const body = await req.json().catch(() => ({}))
  if (!base) {
    // Echo back for demo; no persistence
    return NextResponse.json({ data: body?.data ?? body ?? fallbackSchema })
  }
  try {
    const url = new URL('/api/v1/materials/warehouse/schema', base)
    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ data: fallbackSchema })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackSchema })
  }
}


