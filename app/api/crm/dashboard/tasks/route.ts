import { NextResponse } from 'next/server'

type Task = { id: string; type: 'call' | 'meeting' | 'followup'; with: string; at: string }

const fallbackData: Task[] = [
  { id: 't1', type: 'call', with: 'Contoso', at: '2025-08-08T14:00:00Z' },
  { id: 't2', type: 'meeting', with: 'Northwind', at: '2025-08-09T10:30:00Z' },
  { id: 't3', type: 'followup', with: 'TechCorp', at: '2025-08-09T15:00:00Z' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/crm/dashboard/tasks
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackData })
  }

  const url = new URL('/api/v1/crm/dashboard/tasks', base)
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
