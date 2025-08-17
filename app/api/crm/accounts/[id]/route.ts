import { NextResponse } from 'next/server'

const fallback = (id: string) => ({
  id,
  name: 'Contoso Ltd',
  type: 'enterprise',
  status: 'active',
  country: 'US',
  contacts: [
    { id: 'c1', name: 'Jane Doe', role: 'CFO', email: 'jane@contoso.com' },
    { id: 'c2', name: 'John Smith', role: 'IT Director', email: 'john@contoso.com' },
  ],
  recentActivity: [
    { id: 'a1', subject: 'Invoice paid', at: '2025-08-02T12:00:00Z' },
    { id: 'a2', subject: 'Support ticket created', at: '2025-08-03T09:15:00Z' },
  ],
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const base = process.env.API_BASE_URL
  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  if (!base) return NextResponse.json({ data: fallback(id) })
  const url = new URL(`/api/v1/crm/accounts/${id}`, base)
  try {
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallback(id) })
    const json = await res.json()
    return NextResponse.json({ data: json?.data ?? json })
  } catch {
    return NextResponse.json({ data: fallback(id) })
  }
}


