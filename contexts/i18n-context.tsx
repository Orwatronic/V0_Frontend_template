"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_LOCALE,
  LOCALES,
  PSEUDO_LOCALE,
  getDir,
  getBrowserLocale,
  getTranslationWithFallback,
  trackMissingKey,
  toPseudoLocale,
  useFormatters,
  type Locale,
  formatWithVars,
  type TranslateFn,
} from "@/lib/i18n"

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TranslateFn
  dir: "ltr" | "rtl"
  formatters: ReturnType<typeof useFormatters>
  isPseudoLocale: boolean
  isReady: boolean
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)
const STORAGE_KEY = "feebee_locale"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isPseudoLocale, setIsPseudoLocale] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Initialize from localStorage or browser preference - only run once
  useEffect(() => {
    let mounted = true

    const initializeLocale = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Locale | null

        if (process.env.NODE_ENV !== "production") {
          const urlParams = new URLSearchParams(window.location.search)
          if (urlParams.get("pseudo") === "true" || stored === PSEUDO_LOCALE) {
            if (mounted) {
              setIsPseudoLocale(true)
              setLocaleState("en") // Use English as base for pseudo-locale
              setIsReady(true)
            }
            return
          }
        }

        const finalLocale = stored && LOCALES.includes(stored) ? stored : getBrowserLocale()
        if (mounted) {
          setLocaleState(finalLocale)
          setIsPseudoLocale(false)
          setIsReady(true)
        }
      } catch {
        if (mounted) {
          setLocaleState(getBrowserLocale())
          setIsPseudoLocale(false)
          setIsReady(true)
        }
      }
    }

    initializeLocale()

    return () => {
      mounted = false
    }
  }, []) // Empty dependency array - only run once

  // Update HTML attributes when locale changes
  useEffect(() => {
    if (isReady && typeof document !== "undefined") {
      document.documentElement.lang = isPseudoLocale ? PSEUDO_LOCALE : locale
      document.documentElement.dir = getDir(locale)
    }
  }, [locale, isPseudoLocale, isReady])

  const setLocale = useCallback((l: Locale) => {
    if (l === (PSEUDO_LOCALE as any)) {
      setIsPseudoLocale(true)
      setLocaleState("en")
      try {
        localStorage.setItem(STORAGE_KEY, PSEUDO_LOCALE)
      } catch {
        // ignore storage errors
      }
      return
    }

    setIsPseudoLocale(false)
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore storage errors
    }
  }, [])

  const t: TranslateFn = useCallback(
    (key: string, vars?: Record<string, string | number>, count?: number) => {
      if (!isReady) return key

      // Try to get translation with fallback
      const value = getTranslationWithFallback(key, locale)

      if (typeof value === "string") {
        const formatted = formatWithVars(value, vars, count)
        // Apply pseudo-locale transformation if enabled
        return isPseudoLocale ? toPseudoLocale(formatted) : formatted
      }

      // Track missing key for development
      trackMissingKey(key, locale)

      // Return pseudo-locale version of key if enabled
      return isPseudoLocale ? toPseudoLocale(key) : key
    },
    [locale, isPseudoLocale, isReady],
  )

  const formatters = useFormatters(locale)

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir: getDir(locale),
      formatters,
      isPseudoLocale,
      isReady,
    }),
    [locale, setLocale, t, formatters, isPseudoLocale, isReady],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export type { Locale }
