import fs from "fs"
import path from "path"

interface TranslationFile {
  [key: string]: string | TranslationFile
}

interface KeyReport {
  missingKeys: Record<string, string[]>
  extraKeys: Record<string, string[]>
  duplicateKeys: string[]
  totalKeys: Record<string, number>
}

const LOCALES_DIR = path.join(process.cwd(), "locales")
const SUPPORTED_LOCALES = ["en", "ar", "no"]

function flattenKeys(obj: TranslationFile, prefix = ""): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      keys.push(fullKey)
    } else if (typeof value === "object" && value !== null) {
      keys.push(...flattenKeys(value, fullKey))
    }
  }

  return keys
}

function loadTranslationFile(locale: string): TranslationFile | null {
  const filePath = path.join(LOCALES_DIR, locale, "translation.json")

  try {
    const content = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to load translation file for ${locale}:`, error)
    return null
  }
}

function checkForDuplicateKeys(obj: TranslationFile, prefix = "", seen = new Set<string>()): string[] {
  const duplicates: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (seen.has(fullKey)) {
      duplicates.push(fullKey)
    } else {
      seen.add(fullKey)
    }

    if (typeof value === "object" && value !== null) {
      duplicates.push(...checkForDuplicateKeys(value, fullKey, seen))
    }
  }

  return duplicates
}

function generateReport(): KeyReport {
  const report: KeyReport = {
    missingKeys: {},
    extraKeys: {},
    duplicateKeys: [],
    totalKeys: {},
  }

  // Load all translation files
  const translations: Record<string, TranslationFile> = {}
  const allKeys: Record<string, string[]> = {}

  for (const locale of SUPPORTED_LOCALES) {
    const translation = loadTranslationFile(locale)
    if (translation) {
      translations[locale] = translation
      allKeys[locale] = flattenKeys(translation)
      report.totalKeys[locale] = allKeys[locale].length

      // Check for duplicate keys within each locale
      const duplicates = checkForDuplicateKeys(translation)
      if (duplicates.length > 0) {
        console.warn(`Duplicate keys found in ${locale}:`, duplicates)
        report.duplicateKeys.push(...duplicates.map((key) => `${locale}:${key}`))
      }
    }
  }

  // Find the reference locale (usually 'en')
  const referenceLocale = "en"
  const referenceKeys = allKeys[referenceLocale] || []

  // Compare each locale against the reference
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === referenceLocale) continue

    const localeKeys = allKeys[locale] || []

    // Find missing keys (in reference but not in current locale)
    const missing = referenceKeys.filter((key) => !localeKeys.includes(key))
    if (missing.length > 0) {
      report.missingKeys[locale] = missing
    }

    // Find extra keys (in current locale but not in reference)
    const extra = localeKeys.filter((key) => !referenceKeys.includes(key))
    if (extra.length > 0) {
      report.extraKeys[locale] = extra
    }
  }

  return report
}

function printReport(report: KeyReport) {
  console.log("\n=== i18n Key Analysis Report ===\n")

  // Summary
  console.log("📊 Summary:")
  for (const [locale, count] of Object.entries(report.totalKeys)) {
    console.log(`  ${locale}: ${count} keys`)
  }
  console.log()

  // Missing keys
  if (Object.keys(report.missingKeys).length > 0) {
    console.log("❌ Missing Keys:")
    for (const [locale, keys] of Object.entries(report.missingKeys)) {
      console.log(`  ${locale} (${keys.length} missing):`)
      keys.forEach((key) => console.log(`    - ${key}`))
    }
    console.log()
  } else {
    console.log("✅ No missing keys found\n")
  }

  // Extra keys
  if (Object.keys(report.extraKeys).length > 0) {
    console.log("➕ Extra Keys:")
    for (const [locale, keys] of Object.entries(report.extraKeys)) {
      console.log(`  ${locale} (${keys.length} extra):`)
      keys.forEach((key) => console.log(`    - ${key}`))
    }
    console.log()
  } else {
    console.log("✅ No extra keys found\n")
  }

  // Duplicate keys
  if (report.duplicateKeys.length > 0) {
    console.log("🔄 Duplicate Keys:")
    report.duplicateKeys.forEach((key) => console.log(`  - ${key}`))
    console.log()
  } else {
    console.log("✅ No duplicate keys found\n")
  }

  // Overall status
  const hasIssues =
    Object.keys(report.missingKeys).length > 0 ||
    Object.keys(report.extraKeys).length > 0 ||
    report.duplicateKeys.length > 0

  if (hasIssues) {
    console.log("🚨 Issues found! Please review and fix the above problems.")
    process.exit(1)
  } else {
    console.log("🎉 All translation files are in sync!")
  }
}

// Run the check
if (require.main === module) {
  const report = generateReport()
  printReport(report)
}

export { generateReport, printReport }
