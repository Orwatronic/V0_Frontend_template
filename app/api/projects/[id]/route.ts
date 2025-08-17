import { NextResponse } from 'next/server'

type Project = {
  id: string
  name: string
  status: 'Planned' | 'Active' | 'Closed'
  manager: string
}

const fallbackProjects: Project[] = [
  { id: 'PRJ-001', name: 'ERP Rollout Phase 1', status: 'Active', manager: 'Alice' },
  { id: 'PRJ-002', name: 'Warehouse Upgrade', status: 'Planned', manager: 'Bob' },
  { id: 'PRJ-003', name: 'Website Revamp', status: 'Closed', manager: 'Carol' },
]

export async function GET(_req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to GET /api/v1/projects/{id}
  const base = process.env.API_BASE_URL
  if (!base) {
    const item = fallbackProjects.find(p => p.id === context.params.id)
    return NextResponse.json({ data: item ?? null })
  }
  const url = new URL(`/api/v1/projects/${encodeURIComponent(context.params.id)}`, base)
  try {
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const item = fallbackProjects.find(p => p.id === context.params.id)
    return NextResponse.json({ data: item ?? null })
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to PATCH /api/v1/projects/{id}
  const body = await req.json().catch(() => ({}))
  const base = process.env.API_BASE_URL
  if (!base) {
    const existing = fallbackProjects.find(p => p.id === context.params.id) ?? null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
  const url = new URL(`/api/v1/projects/${encodeURIComponent(context.params.id)}`, base)
  try {
    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const existing = fallbackProjects.find(p => p.id === context.params.id) ?? null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
}


