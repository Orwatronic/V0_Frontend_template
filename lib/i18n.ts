export type Locale = "en" | "ar" | "no"

export const LOCALES: Locale[] = ["en", "ar", "no"]
export const DEFAULT_LOCALE: Locale = "en"

import en from "@/locales/en/translation.json"
import ar from "@/locales/ar/translation.json"
import no from "@/locales/no/translation.json"

export const bundles: Record<Locale, Record<string, unknown>> = {
  en,
  ar,
  no,
}

export const PSEUDO_LOCALE = "en-XA"
export const PSEUDO_LOCALES = [PSEUDO_LOCALE] as const

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE
  const lang = (navigator.language || navigator.languages?.[0] || "en").toLowerCase()
  // Normalize to supported locales
  if (lang.startsWith("ar")) return "ar"
  if (lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn")) return "no"
  return "en"
}

export function getByPath(obj: Record<string, any>, path: string): unknown {
  return path.split(".").reduce((acc: any, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj)
}

export type TranslateFn = (key: string, vars?: Record<string, string | number>, count?: number) => string

export function formatWithVars(input: string, vars?: Record<string, string | number>, count?: number) {
  if (!vars && count === undefined) return input

  let result = input

  // Handle pluralization
  if (count !== undefined) {
    result = handlePluralization(result, count)
  }

  // Handle variable interpolation
  if (vars) {
    result = Object.keys(vars).reduce((acc, k) => acc.replace(new RegExp(`{{${k}}}`, "g"), String(vars[k])), result)
  }

  return result
}

function handlePluralization(input: string, count: number): string {
  // Simple English pluralization rules
  // Format: "item|items" or "{{count}} item|{{count}} items"
  const pluralMatch = input.match(/^(.+?)\|(.+?)$/)
  if (!pluralMatch) return input

  const [, singular, plural] = pluralMatch
  return count === 1 ? singular : plural
}

export function toPseudoLocale(text: string): string {
  // Transform text to pseudo-locale for testing
  // Add brackets and extend length to test UI layout
  const extended = text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      a: "á",
      e: "é",
      i: "í",
      o: "ó",
      u: "ú",
      A: "Á",
      E: "É",
      I: "Í",
      O: "Ó",
      U: "Ú",
      n: "ñ",
      N: "Ñ",
      c: "ç",
      C: "Ç",
    }
    return map[char] || char
  })
  return `[${extended}]`
}

export function getTranslationWithFallback(key: string, locale: Locale): string | undefined {
  // Try current locale first
  let bundle = bundles[locale]
  let value = getByPath(bundle as any, key)

  if (typeof value === "string") return value

  // Fallback to English if not found
  if (locale !== DEFAULT_LOCALE) {
    bundle = bundles[DEFAULT_LOCALE]
    value = getByPath(bundle as any, key)
    if (typeof value === "string") return value
  }

  return undefined
}

const missingKeys = new Set<string>()

export function trackMissingKey(key: string, locale: Locale) {
  if (process.env.NODE_ENV !== "production") {
    const keyId = `${locale}:${key}`
    if (!missingKeys.has(keyId)) {
      missingKeys.add(keyId)
      console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`)
    }
  }
}

export function getMissingKeys(): string[] {
  return Array.from(missingKeys)
}

export const formatters = {
  // Number formatting
  number: (value: number, locale: Locale, options?: Intl.NumberFormatOptions) => {
    const localeCode = getIntlLocale(locale)
    return new Intl.NumberFormat(localeCode, options).format(value)
  },

  // Currency formatting
  currency: (value: number, locale: Locale, currency = "USD", options?: Intl.NumberFormatOptions) => {
    const localeCode = getIntlLocale(locale)
    return new Intl.NumberFormat(localeCode, {
      style: "currency",
      currency,
      ...options,
    }).format(value)
  },

  // Date formatting
  date: (value: Date | string | number, locale: Locale, options?: Intl.DateTimeFormatOptions) => {
    const localeCode = getIntlLocale(locale)
    const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value
    return new Intl.DateTimeFormat(localeCode, options).format(date)
  },

  // Relative time formatting
  relativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    locale: Locale,
    options?: Intl.RelativeTimeFormatOptions,
  ) => {
    const localeCode = getIntlLocale(locale)
    return new Intl.RelativeTimeFormat(localeCode, options).format(value, unit)
  },

  // Percentage formatting
  percent: (value: number, locale: Locale, options?: Intl.NumberFormatOptions) => {
    const localeCode = getIntlLocale(locale)
    return new Intl.NumberFormat(localeCode, {
      style: "percent",
      ...options,
    }).format(value)
  },
}

function getIntlLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    ar: "ar-SA",
    no: "nb-NO",
  }
  return localeMap[locale] || "en-US"
}

export function useFormatters(locale: Locale) {
  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => formatters.number(value, locale, options),
    formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) =>
      formatters.currency(value, locale, currency, options),
    formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
      formatters.date(value, locale, options),
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) =>
      formatters.relativeTime(value, unit, locale, options),
    formatPercent: (value: number, options?: Intl.NumberFormatOptions) => formatters.percent(value, locale, options),
  }
}
