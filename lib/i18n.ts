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

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

export function formatWithVars(input: string, vars?: Record<string, string | number>) {
  if (!vars) return input
  return Object.keys(vars).reduce((acc, k) => acc.replace(new RegExp(`{${k}}`, "g"), String(vars[k])), input)
}
