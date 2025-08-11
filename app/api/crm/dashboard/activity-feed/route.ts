import { NextResponse } from 'next/server'

type ActivityItem =
  | { id: string; type: 'quotation'; company: string; at: string }
  | { id: string; type: 'support'; customer: string; at: string }
  | { id: string; type: 'invoice'; customer: string; at: string }

const fallbackData: ActivityItem[] = [
  { id: 'a1', type: 'quotation', company: 'TechCorp', at: '2025-08-07T12:00:00Z' },
  { id: 'a2', type: 'support', customer: 'Acme Inc.', at: '2025-08-07T09:30:00Z' },
  { id: 'a3', type: 'invoice', customer: 'Global Tech', at: '2025-08-06T16:10:00Z' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/crm/dashboard/activity-feed
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackData })
  }

  const url = new URL('/api/v1/crm/dashboard/activity-feed', base)
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
