import { NextResponse } from 'next/server'

type Opportunity = { id: string; stage: 'lead' | 'qualified' | 'proposal' | 'won' }

const fallbackData: Opportunity[] = [
  { id: 'o1', stage: 'lead' },
  { id: 'o2', stage: 'lead' },
  { id: 'o3', stage: 'qualified' },
  { id: 'o4', stage: 'proposal' },
  { id: 'o5', stage: 'won' },
  { id: 'o6', stage: 'qualified' },
  { id: 'o7', stage: 'proposal' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/sales/pipeline/opportunities
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackData })
  }

  const url = new URL('/api/v1/sales/pipeline/opportunities', base)
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10_000)

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
        ...(req.headers.get('cookie') ? { cookie: req.headers.get('cookie') as string } : {}),
      },
      cache: 'no-store',
      signal: abortController.signal,
    })
    if (!res.ok) {
      return NextResponse.json({ data: fallbackData })
    }
    const backendJson = await res.json()
    const data = Array.isArray(backendJson)
      ? backendJson
      : backendJson?.data ?? backendJson?.items ?? fallbackData
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackData })
  } finally {
    clearTimeout(timeout)
  }
}
