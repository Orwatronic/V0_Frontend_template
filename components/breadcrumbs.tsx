"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'

const Breadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((segment) => segment)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const isLast = index === pathSegments.length - 1
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

    return { href, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center space-x-2 text-sm">
      <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link
            href={breadcrumb.href}
            aria-current={breadcrumb.isLast ? "page" : undefined}
            className={
              breadcrumb.isLast
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {breadcrumb.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumbs
