import { NextResponse } from 'next/server'

const fallbackDetails = {
  general: { id: 'C001', name: 'Innovate Corp', type: 'Enterprise', industry: 'Technology', taxId: 'US123456789' },
  contacts: [{ id: 1, name: 'Jane Doe', role: 'CEO', email: 'jane.doe@innovate.com', phone: '123-456-7890' }],
  addresses: [ { id: 1, type: 'Billing', line1: '123 Tech Ave', city: 'Palo Alto', state: 'CA', zip: '94301', country: 'USA' } ],
  financial: { creditLimit: 500000, paymentTerms: 'NET 30', currency: 'USD', bankName: 'Bank of America' },
  documents: [ { id: 1, name: 'Master Service Agreement.pdf', type: 'Contract', uploaded: '2023-01-15' } ],
  history: [ { id: 1, user: 'admin', action: 'Created Record', timestamp: '2023-01-15 10:00:00' } ],
}

export async function GET(_req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to GET /api/v1/mdm/customers/{id}
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: { id: context.params.id, ...fallbackDetails } })
  }
  try {
    const url = new URL(`/api/v1/mdm/customers/${encodeURIComponent(context.params.id)}`, base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: { id: context.params.id, ...fallbackDetails } })
  }
}


