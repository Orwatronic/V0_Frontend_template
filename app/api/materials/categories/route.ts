import { NextResponse } from 'next/server'

type CategoryNode = { id: string; name: string; children?: CategoryNode[] }

const fallbackCategories: CategoryNode[] = [
  { id: 'raw', name: 'Raw Materials', children: [ { id: 'metals', name: 'Metals' }, { id: 'plastics', name: 'Plastics' } ] },
  { id: 'finished', name: 'Finished Goods', children: [ { id: 'electronics', name: 'Electronics' }, { id: 'apparel', name: 'Apparel' } ] },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/materials/categories
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackCategories })
  }
  try {
    const url = new URL('/api/v1/materials/categories', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackCategories })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackCategories })
  }
}


