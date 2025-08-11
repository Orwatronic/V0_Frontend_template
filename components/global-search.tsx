"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, File, ShoppingCart, Users, Package, Building } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

// Mock search results
// CURSOR: API call to GET /api/v1/search?q={query}
const mockResults = {
  customers: [
    { id: "cus-1", name: "Innovate Inc.", href: "/mdm/customers/1" },
    { id: "cus-2", name: "Quantum Solutions", href: "/mdm/customers/2" },
  ],
  salesOrders: [
    { id: "so-123", name: "SO-2024-0123", href: "/sales/orders/123" },
    { id: "so-124", name: "SO-2024-0124", href: "/sales/orders/124" },
  ],
  employees: [
    { id: "emp-a", name: "Alice Johnson", href: "/employees/a" },
    { id: "emp-b", name: "Bob Williams", href: "/employees/b" },
  ],
  materials: [
    { id: "mat-x", name: "MX-4 Thermal Compound", href: "/materials/x" },
    { id: "mat-y", name: "High-Grade Silicon Wafer", href: "/materials/y" },
  ],
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter()

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Customers">
          {mockResults.customers.map((customer) => (
            <CommandItem
              key={customer.id}
              value={`customer-${customer.name}`}
              onSelect={() => runCommand(() => router.push(customer.href))}
            >
              <Building className="mr-2 h-4 w-4" />
              <span>{customer.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Sales Orders">
          {mockResults.salesOrders.map((order) => (
            <CommandItem
              key={order.id}
              value={`sales-order-${order.name}`}
              onSelect={() => runCommand(() => router.push(order.href))}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>{order.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Employees">
          {mockResults.employees.map((employee) => (
            <CommandItem
              key={employee.id}
              value={`employee-${employee.name}`}
              onSelect={() => runCommand(() => router.push(employee.href))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{employee.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Materials">
          {mockResults.materials.map((material) => (
            <CommandItem
              key={material.id}
              value={`material-${material.name}`}
              onSelect={() => runCommand(() => router.push(material.href))}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>{material.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
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
