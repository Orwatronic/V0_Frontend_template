"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bell,
  Building,
  ChevronsUpDown,
  Search,
  Database,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
  BarChart3,
  Sun,
  Moon,
  Laptop,
  FileBarChart,
  UserCircle2,
  Building2,
  Handshake,
  Factory,
  ShieldCheck,
  Wrench,
  ClipboardList,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import Breadcrumbs from "./breadcrumbs"
import { NotificationsPanel } from "./notifications-panel"
import { Badge } from "./ui/badge"
import { GlobalSearch } from "./global-search"
import { Sidebar, type SidebarItem } from "./sidebar"
import { useUIStore } from "@/hooks/use-ui-store"
import { useI18n } from "@/contexts/i18n-context"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

interface NavItem {
  id: string
  href: string
  icon: LucideIcon
  label: string
  permission: string
}

const baseNavItems: NavItem[] = [
  { id: "dashboard", href: "/dashboard", icon: Home, label: "Dashboard", permission: "view:dashboard" },
  { id: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics", permission: "view:analytics" },
  { id: "financials", href: "/financial", icon: DollarSign, label: "Financials", permission: "view:financials" },
  { id: "sales", href: "/sales", icon: ShoppingCart, label: "Sales", permission: "view:sales" },
  { id: "materials", href: "/materials", icon: Package, label: "Materials", permission: "view:materials" },
  { id: "hcm", href: "/employees", icon: Users, label: "HCM", permission: "view:hcm" },
  { id: "mdm", href: "/mdm", icon: Database, label: "Master Data", permission: "view:mdm" },

  // Newly added modules (now visible in sidebar)
  { id: "reports", href: "/reports", icon: FileBarChart, label: "Reports", permission: "view:reports" },
  {
    id: "customer-portal",
    href: "/customer-portal",
    icon: UserCircle2,
    label: "Customer Portal",
    permission: "view:customer-portal",
  },
  { id: "org-management", href: "/org-management", icon: Building2, label: "Org Mgmt", permission: "view:org-mgmt" },
  { id: "crm", href: "/crm", icon: Handshake, label: "CRM", permission: "view:crm" },
  { id: "production", href: "/production", icon: Factory, label: "Production", permission: "view:production" },
  { id: "quality", href: "/quality", icon: ShieldCheck, label: "Quality", permission: "view:quality" },
  { id: "plant", href: "/plant-maintenance", icon: Wrench, label: "Plant Maintenance", permission: "view:plant" },
  {
    id: "project-system",
    href: "/project-system",
    icon: ClipboardList,
    label: "Project System",
    permission: "view:project-system",
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { user, company, setCompany, logout } = useAuth()
  const { hasPermission } = usePermissions()
  const { t } = useI18n() // Added useI18n hook
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  useUIStore() // ensures re-render on sidebar state changes

  const accessibleNavItems = useMemo(
    () => baseNavItems.filter((item) => hasPermission(item.permission)),
    [hasPermission, t], // Added t to dependency array
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // CURSOR: API call to GET /api/v1/users/me
  const userProfile = {
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    initials: user?.name?.charAt(0).toUpperCase() || "G",
  }

  // CURSOR: API call to GET /api/v1/users/me/companies
  const userCompanies = [
    { id: "fb-tech", name: "Feebee Technologies" },
    { id: "fb-retail", name: "Feebee Retail Solutions" },
    { id: "fb-logistics", name: "Future Logistics Inc." },
  ]
  const currentCompany = userCompanies.find((c) => c.id === company) || userCompanies[0]

  const sidebarItems: SidebarItem[] = useMemo(
    () =>
      accessibleNavItems.map((i) => ({
        id: i.id,
        href: i.href,
        icon: i.icon,
        label: i.label,
      })),
    [accessibleNavItems],
  )

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <Sidebar items={sidebarItems} />

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <span className="sr-only">Feebee ERP</span>
                  </Link>
                  {sidebarItems.map((item) => {
                    const active = pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                          active ? "bg-muted text-foreground" : "text-muted-foreground",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Building className="h-4 w-4" />
                    <span className="hidden md:inline">{currentCompany.name}</span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={company || ""} onValueChange={setCompany}>
                    {userCompanies.map((comp) => (
                      <DropdownMenuRadioItem key={comp.id} value={comp.id}>
                        {comp.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="p-2 md:w-40 lg:w-64 justify-start text-sm text-muted-foreground bg-transparent"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden md:inline-flex">Search...</span>
                <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            <div className="w-full flex-1">
              <Breadcrumbs />
            </div>

            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full relative"
                    onClick={() => setNotificationsOpen(true)}
                    aria-label="Open notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      2
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="rounded-full pl-2 pr-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-semibold text-primary-foreground">{userProfile.initials}</span>
                    </div>
                    <span className="hidden md:inline">{userProfile.name}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-bold">{userProfile.name}</div>
                    <div className="text-xs text-muted-foreground">{userProfile.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/50">{children}</main>
        </div>
      </div>
      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </TooltipProvider>
  )
}
