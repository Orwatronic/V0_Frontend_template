"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronsLeftRight, Home, BarChart3, DollarSign, ShoppingCart, Package, Users, Database, FileBarChart, UserCircle2, Building2, Handshake, Factory, ShieldCheck, Wrench, ClipboardList, TypeIcon as type, LucideIcon } from 'lucide-react'
import { useUIStore } from "@/hooks/use-ui-store"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export type SidebarItem = {
  id: string
  href: string
  icon: LucideIcon
  label: string
}

type Props = {
  items: SidebarItem[]
}

type NavCounts = Record<string, number>

export function Sidebar({ items }: Props) {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const [counts, setCounts] = React.useState<NavCounts>({})
  const itemRefs = React.useRef<Array<HTMLAnchorElement | null>>([])

  React.useEffect(() => {
    let active = true
    async function fetchCounts() {
      // CURSOR: API call to GET /api/v1/users/me/navigation
      // CURSOR: API call to GET /api/v1/notifications/count
      await new Promise((r) => setTimeout(r, 150))
      const mock: NavCounts = {
        financials: 3,
        sales: 1,
        hcm: 2,
        reports: 4,
        crm: 2,
        production: 1,
      }
      if (active) setCounts(mock)
    }
    fetchCounts()
    return () => {
      active = false
    }
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    const focusable = itemRefs.current
    const idx = focusable.findIndex((el) => el === document.activeElement)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = (idx + 1) % focusable.length
      focusable[next]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (idx - 1 + focusable.length) % focusable.length
      focusable[prev]?.focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      focusable[0]?.focus()
    } else if (e.key === "End") {
      e.preventDefault()
      focusable[focusable.length - 1]?.focus()
    }
  }

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        toggleSidebar()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [toggleSidebar])

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden md:block border-r bg-muted/40 transition-[width] duration-200 ease-in-out",
          sidebarCollapsed ? "w-[72px]" : "w-[236px] lg:w-[280px]"
        )}
        aria-label="Primary"
      >
        <div className="flex h-full max-h-screen flex-col">
          {/* Header */}
          <div className="flex h-14 items-center border-b px-3 lg:px-4">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              {!sidebarCollapsed && <span>Feebee ERP</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto w-8 h-8"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={sidebarCollapsed}
              title={sidebarCollapsed ? "Expand sidebar (Ctrl/Cmd+B)" : "Collapse sidebar (Ctrl/Cmd+B)"}
            >
              <ChevronsLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Nav */}
          <nav
            className="flex-1 px-2 py-2 lg:px-3"
            onKeyDown={handleKeyDown}
            aria-orientation="vertical"
            role="navigation"
          >
            <ul className={cn("grid gap-1 text-sm font-medium", sidebarCollapsed ? "place-items-center" : "items-start")}>
              {items.map((item, idx) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                const count = counts[item.id] ?? 0

                const content = (
                  <Link
                    ref={(el) => (itemRefs.current[idx] = el)}
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "relative group flex items-center gap-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      active ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary",
                      sidebarCollapsed ? "justify-center w-10 h-10 px-0 mx-auto" : "px-3 py-2"
                    )}
                    aria-current={active ? "page" : undefined}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

                    {!sidebarCollapsed && count > 0 && (
                      <Badge className="ml-auto h-5 px-1.5 text-[10px]" variant="secondary">
                        {count}
                      </Badge>
                    )}
                    {sidebarCollapsed && count > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )

                return (
                  <li key={item.id} className="list-none">
                    {sidebarCollapsed ? (
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5" />
                            <span>{item.label}</span>
                            {count > 0 && (
                              <Badge className="ml-1 h-4 px-1 text-[10px]" variant="secondary">
                                {count}
                              </Badge>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  )
}
