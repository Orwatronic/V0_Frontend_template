import { NextResponse } from 'next/server'

type Project = {
  id: string
  name: string
  status: 'Planned' | 'Active' | 'Closed'
  manager: string
}

// Development fallback data if backend is unavailable
const fallbackProjects: Project[] = [
  { id: 'PRJ-001', name: 'ERP Rollout Phase 1', status: 'Active', manager: 'Alice' },
  { id: 'PRJ-002', name: 'Warehouse Upgrade', status: 'Planned', manager: 'Bob' },
  { id: 'PRJ-003', name: 'Website Revamp', status: 'Closed', manager: 'Carol' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/projects
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackProjects })
  }

  const url = new URL('/api/v1/projects', base)
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
      return NextResponse.json({ data: fallbackProjects })
    }
    const backendJson = await res.json()
    const data = Array.isArray(backendJson)
      ? backendJson
      : backendJson?.data ?? backendJson?.items ?? fallbackProjects
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackProjects })
  } finally {
    clearTimeout(timeout)
  }
}


