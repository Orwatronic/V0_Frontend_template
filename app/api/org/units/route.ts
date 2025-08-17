import { NextResponse } from 'next/server'

type OrgUnit = { id: string; name: string; costCenters: number; status: 'Active' | 'Inactive' }

const fallbackUnits: OrgUnit[] = [
  { id: 'ORG-01', name: 'Headquarters', costCenters: 12, status: 'Active' },
  { id: 'ORG-02', name: 'Manufacturing', costCenters: 8, status: 'Active' },
  { id: 'ORG-03', name: 'R&D', costCenters: 3, status: 'Inactive' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/org/units
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackUnits })
  }
  try {
    const url = new URL('/api/v1/org/units', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackUnits })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackUnits })
  }
}


