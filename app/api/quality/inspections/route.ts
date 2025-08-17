import { NextResponse } from 'next/server'

type Inspection = { id: string; date: string; status: 'Open' | 'Closed' | 'InProgress'; description: string }

const fallbackInspections: Inspection[] = [
  { id: 'INSP-1001', date: '2024-08-01', status: 'Open', description: 'Incoming goods check – Lot A' },
  { id: 'INSP-1002', date: '2024-08-03', status: 'InProgress', description: 'In-process inspection – Line 2' },
  { id: 'INSP-1003', date: '2024-08-05', status: 'Closed', description: 'Final inspection – Order 789' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/quality/inspections
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackInspections })
  }
  try {
    const url = new URL('/api/v1/quality/inspections', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackInspections })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackInspections })
  }
}


