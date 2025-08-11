import { NextResponse } from 'next/server'

type KpiItem = {
  id: string
  labelKey: string
  value: string
  helper?: string
  icon: 'users' | 'trendingUp' | 'dollarSign' | 'smile'
}

// Development fallback data if backend is unavailable
const fallbackData: KpiItem[] = [
  { id: 'newLeads', labelKey: 'crm.dashboard.kpis.newLeads', value: '128', helper: 'crm.dashboard.kpis.thisMonth', icon: 'users' },
  { id: 'conversionRate', labelKey: 'crm.dashboard.kpis.conversionRate', value: '12.4%', helper: 'crm.dashboard.kpis.thisMonth', icon: 'trendingUp' },
  { id: 'clv', labelKey: 'crm.dashboard.kpis.clv', value: '$19,240', helper: 'crm.dashboard.kpis.thisMonth', icon: 'dollarSign' },
  { id: 'csat', labelKey: 'crm.dashboard.kpis.csat', value: '92', helper: 'crm.dashboard.kpis.csatUnit', icon: 'smile' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/crm/dashboard/kpis
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackData })
  }

  const url = new URL('/api/v1/crm/dashboard/kpis', base)
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
      // Graceful fallback to keep /crm working in dev/preview
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
