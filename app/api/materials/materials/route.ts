import { NextResponse } from 'next/server'

type Material = { id: string; name: string; category: string; type: string; uom: string; status: string; onHand: number }

const fallbackMaterials: Material[] = [
  { id: 'M001', name: 'Steel Plate', category: 'metals', type: 'Raw', uom: 'KG', status: 'active', onHand: 1500 },
  { id: 'M002', name: 'ABS Pellets', category: 'plastics', type: 'Raw', uom: 'KG', status: 'active', onHand: 3000 },
  { id: 'M003', name: 'Microcontroller', category: 'electronics', type: 'Component', uom: 'EA', status: 'active', onHand: 10000 },
  { id: 'M004', name: 'Cotton T-Shirt', category: 'apparel', type: 'Finished', uom: 'EA', status: 'inactive', onHand: 500 },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/materials?category={id}
  const base = process.env.API_BASE_URL
  const urlInput = new URL(req.url)
  const category = urlInput.searchParams.get('category')
  if (!base) {
    const filtered = category && category !== 'all' ? fallbackMaterials.filter(m => m.category === category) : fallbackMaterials
    return NextResponse.json({ data: filtered })
  }
  try {
    const url = new URL('/api/v1/materials', base)
    if (category) url.searchParams.set('category', category)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackMaterials })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackMaterials })
  }
}


