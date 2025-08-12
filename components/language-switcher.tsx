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
import { Globe } from "lucide-react"
import { PSEUDO_LOCALE } from "@/lib/i18n"
import type { Locale } from "@/contexts/i18n-context"

const LABELS: Record<Locale | typeof PSEUDO_LOCALE, string> = {
  en: "English",
  ar: "العربية",
  no: "Norsk",
  [PSEUDO_LOCALE]: "Pseudo (Test)",
}

export function LanguageSwitcher() {
  const { locale, setLocale, isPseudoLocale } = useI18n()

  const currentLabel = isPseudoLocale ? LABELS[PSEUDO_LOCALE] : LABELS[locale]
  const isDevelopment = process.env.NODE_ENV !== "production"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(["en", "ar", "no"] as Locale[]).map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => setLocale(lng)}
            className={lng === locale && !isPseudoLocale ? "font-semibold" : ""}
          >
            {LABELS[lng]}
          </DropdownMenuItem>
        ))}
        {isDevelopment && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setLocale(PSEUDO_LOCALE as any)}
              className={isPseudoLocale ? "font-semibold" : ""}
            >
              {LABELS[PSEUDO_LOCALE]}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
