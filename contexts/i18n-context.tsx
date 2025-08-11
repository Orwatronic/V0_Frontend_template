"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { DEFAULT_LOCALE, LOCALES, bundles, getByPath, getDir, getBrowserLocale, type Locale, formatWithVars, type TranslateFn } from "@/lib/i18n"

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TranslateFn
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)
const STORAGE_KEY = "feebee_locale"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // initialize from localStorage or browser preference
  useEffect(() => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) as Locale | null) || null
      setLocaleState(stored && LOCALES.includes(stored) ? stored : getBrowserLocale())
    } catch {
      setLocaleState(getBrowserLocale())
    }
  }, [])

  // reflect lang/dir on <html>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
      document.documentElement.dir = getDir(locale)
    }
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore storage errors
    }
  }, [])

  const t: TranslateFn = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const bundle = bundles[locale] || bundles[DEFAULT_LOCALE]
      const value = getByPath(bundle as any, key)
      if (typeof value === "string") return formatWithVars(value, vars)
      // fallback: return key and log once in dev
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`)
      }
      return key
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t, dir: getDir(locale) }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export type { Locale }
