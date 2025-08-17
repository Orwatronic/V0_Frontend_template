import { NextResponse } from 'next/server'

type SearchItem = { id: string; name: string; href: string }

type SearchResult = {
  leads: SearchItem[]
  accounts: SearchItem[]
  contacts: SearchItem[]
  opportunities: SearchItem[]
  quotes: SearchItem[]
  orders: SearchItem[]
}

const fallback: SearchResult = {
  leads: [
    { id: 'L-1001', name: 'Contoso', href: '/crm/leads/L-1001' },
    { id: 'L-1002', name: 'Northwind', href: '/crm/leads/L-1002' },
  ],
  accounts: [
    { id: 'AC-1001', name: 'Contoso Ltd', href: '/crm/accounts/AC-1001' },
    { id: 'AC-1002', name: 'Northwind', href: '/crm/accounts/AC-1002' },
  ],
  contacts: [
    { id: 'CT-2001', name: 'Jane Doe', href: '/crm/contacts/CT-2001' },
    { id: 'CT-2002', name: 'John Smith', href: '/crm/contacts/CT-2002' },
  ],
  opportunities: [
    { id: 'OP-5001', name: 'Feebee ERP rollout', href: '/crm/opportunities' },
  ],
  quotes: [
    { id: 'Q-3001', name: 'Q-3001', href: '/crm/quotes/Q-3001' },
  ],
  orders: [
    { id: 'SO-4001', name: 'SO-4001', href: '/crm/orders/SO-4001' },
  ],
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase().trim()
  if (!q) return NextResponse.json({ data: { leads: [], accounts: [], contacts: [], opportunities: [], quotes: [], orders: [] } })

  // In a real setup, fan out to backend search. For now, filter fallback locally.
  const filterItems = (items: SearchItem[]) => items.filter((i) => i.id.toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
  const data: SearchResult = {
    leads: filterItems(fallback.leads),
    accounts: filterItems(fallback.accounts),
    contacts: filterItems(fallback.contacts),
    opportunities: filterItems(fallback.opportunities),
    quotes: filterItems(fallback.quotes),
    orders: filterItems(fallback.orders),
  }
  return NextResponse.json({ data })
}


