"use client"

import { useI18n } from "@/contexts/i18n-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react'
import type { Locale } from "@/contexts/i18n-context"

const LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  no: "Norsk",
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{LABELS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(["en", "ar", "no"] as Locale[]).map((lng) => (
          <DropdownMenuItem key={lng} onClick={() => setLocale(lng)} className={lng === locale ? "font-semibold" : ""}>
            {LABELS[lng]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
