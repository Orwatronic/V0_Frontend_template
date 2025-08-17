import { NextResponse } from 'next/server'

const fallback = (id: string) => ({
  id,
  company: 'Contoso',
  owner: 'Alice',
  status: 'qualified',
  createdAt: '2025-08-01T09:00:00Z',
  score: 72,
  notes: [
    { id: 'n1', text: 'Initial discovery call complete', at: '2025-08-01T10:00:00Z', by: 'Alice' },
  ],
  attachments: [{ id: 'f1', name: 'requirements.pdf', size: '120 KB' }],
  activities: [
    { id: 'a1', type: 'call', subject: 'Discovery call', at: '2025-08-01T10:00:00Z', by: 'Alice' },
    { id: 'a2', type: 'email', subject: 'Send proposal draft', at: '2025-08-02T09:30:00Z', by: 'Alice' },
  ],
  audit: [
    { id: 'h1', field: 'status', old: 'contacted', new: 'qualified', at: '2025-08-02T09:35:00Z', by: 'Alice' },
  ],
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const base = process.env.API_BASE_URL
  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  if (!base) {
    return NextResponse.json({ data: fallback(id) })
  }

  const url = new URL(`/api/v1/crm/leads/${id}`, base)
  try {
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallback(id) })
    const json = await res.json()
    return NextResponse.json({ data: json?.data ?? json })
  } catch {
    return NextResponse.json({ data: fallback(id) })
  }
}


