"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Settings, User, ShoppingCart, Users, Package, Building, Handshake, Quote, FileText } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

// CURSOR: API call to GET /api/crm/search?q={query}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter()
  const [q, setQ] = React.useState("")
  const [results, setResults] = React.useState<any | null>(null)

  React.useEffect(() => {
    const handle = setTimeout(async () => {
      if (!q) { setResults(null); return }
      try {
        const res = await fetch(`/api/crm/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        const json = await res.json()
        setResults(json?.data || null)
      } catch { setResults(null) }
    }, 200)
    return () => clearTimeout(handle)
  }, [q])

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {results && (
        <>
        <CommandGroup heading="Accounts">
          {results.accounts?.map((acc: any) => (
            <CommandItem
              key={acc.id}
              value={`account-${acc.name}`}
              onSelect={() => runCommand(() => router.push(acc.href))}
            >
              <Building className="mr-2 h-4 w-4" />
              <span>{acc.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Leads">
          {results.leads?.map((lead: any) => (
            <CommandItem
              key={lead.id}
              value={`lead-${lead.name}`}
              onSelect={() => runCommand(() => router.push(lead.href))}
            >
              <Handshake className="mr-2 h-4 w-4" />
              <span>{lead.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Contacts">
          {results.contacts?.map((c: any) => (
            <CommandItem
              key={c.id}
              value={`contact-${c.name}`}
              onSelect={() => runCommand(() => router.push(c.href))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{c.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Opportunities">
          {results.opportunities?.map((o: any) => (
            <CommandItem
              key={o.id}
              value={`opp-${o.name}`}
              onSelect={() => runCommand(() => router.push(o.href))}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>{o.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quotes">
          {results.quotes?.map((q: any) => (
            <CommandItem key={q.id} value={`quote-${q.name}`} onSelect={() => runCommand(() => router.push(q.href))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>{q.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Orders">
          {results.orders?.map((o: any) => (
            <CommandItem key={o.id} value={`order-${o.name}`} onSelect={() => runCommand(() => router.push(o.href))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>{o.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push('/settings/profile'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/settings/billing'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
