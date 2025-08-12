#!/usr/bin/env tsx

import fs from "fs"
import path from "path"

interface TranslationBundle {
  [key: string]: any
}

interface TranslationFile {
  [key: string]: any
}

interface KeyAnalysis {
  allKeys: Set<string>
  missingKeys: { [locale: string]: string[] }
  extraKeys: { [locale: string]: string[] }
  duplicateKeys: { [locale: string]: string[] }
}

const LOCALES_DIR = path.join(process.cwd(), "locales")
const SUPPORTED_LOCALES = ["en", "ar", "no"]

function loadTranslationBundle(locale: string): TranslationBundle {
  const filePath = path.join(LOCALES_DIR, locale, "translation.json")
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file not found: ${filePath}`)
    process.exit(1)
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Failed to parse translation file: ${filePath}`)
    console.error(error)
    process.exit(1)
  }
}

function flattenKeys(obj: any, prefix = ""): string[] {
  const keys: string[] = []

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...flattenKeys(obj[key], fullKey))
      } else {
        keys.push(fullKey)
      }
    }
  }

  return keys
}

function findMissingKeys(baseKeys: string[], targetKeys: string[]): string[] {
  return baseKeys.filter((key) => !targetKeys.includes(key))
}

function findExtraKeys(baseKeys: string[], targetKeys: string[]): string[] {
  return targetKeys.filter((key) => !baseKeys.includes(key))
}

function loadTranslationFile(locale: string): TranslationFile | null {
  const filePath = path.join(LOCALES_DIR, locale, "translation.json")

  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Translation file not found: ${filePath}`)
      return null
    }

    const content = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error loading translation file ${filePath}:`, error)
    return null
  }
}

function findDuplicateKeys(keys: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const key of keys) {
    if (seen.has(key)) {
      duplicates.add(key)
    } else {
      seen.add(key)
    }
  }

  return Array.from(duplicates)
}

function analyzeTranslationKeys(): KeyAnalysis {
  const analysis: KeyAnalysis = {
    allKeys: new Set(),
    missingKeys: {},
    extraKeys: {},
    duplicateKeys: {},
  }

  const translationData: { [locale: string]: TranslationFile } = {}
  const localeKeys: { [locale: string]: string[] } = {}

  // Load all translation files
  for (const locale of SUPPORTED_LOCALES) {
    const data = loadTranslationFile(locale)
    if (data) {
      translationData[locale] = data
      localeKeys[locale] = flattenKeys(data)

      // Find duplicate keys within each locale
      const duplicates = findDuplicateKeys(localeKeys[locale])
      if (duplicates.length > 0) {
        analysis.duplicateKeys[locale] = duplicates
      }

      // Add all keys to the master set
      localeKeys[locale].forEach((key) => analysis.allKeys.add(key))
    } else {
      console.error(`Failed to load translations for locale: ${locale}`)
      localeKeys[locale] = []
    }
  }

  // Analyze missing and extra keys
  for (const locale of SUPPORTED_LOCALES) {
    const currentKeys = new Set(localeKeys[locale])

    analysis.missingKeys[locale] = Array.from(analysis.allKeys).filter((key) => !currentKeys.has(key))
    analysis.extraKeys[locale] = localeKeys[locale].filter((key) => {
      // A key is "extra" if it only exists in this locale and nowhere else
      return !SUPPORTED_LOCALES.some((otherLocale) => otherLocale !== locale && localeKeys[otherLocale].includes(key))
    })
  }

  return analysis
}

function generateReport(analysis: KeyAnalysis): void {
  console.log("\n=== i18n Key Analysis Report ===\n")

  console.log(`Total unique keys found: ${analysis.allKeys.size}`)
  console.log(`Supported locales: ${SUPPORTED_LOCALES.join(", ")}\n`)

  // Report missing keys
  let hasMissingKeys = false
  for (const locale of SUPPORTED_LOCALES) {
    if (analysis.missingKeys[locale].length > 0) {
      hasMissingKeys = true
      console.log(`❌ Missing keys in ${locale}:`)
      analysis.missingKeys[locale].forEach((key) => {
        console.log(`   - ${key}`)
      })
      console.log()
    }
  }

  if (!hasMissingKeys) {
    console.log("✅ No missing keys found!\n")
  }

  // Report extra keys
  let hasExtraKeys = false
  for (const locale of SUPPORTED_LOCALES) {
    if (analysis.extraKeys[locale].length > 0) {
      hasExtraKeys = true
      console.log(`⚠️  Extra keys in ${locale} (not found in other locales):`)
      analysis.extraKeys[locale].forEach((key) => {
        console.log(`   - ${key}`)
      })
      console.log()
    }
  }

  if (!hasExtraKeys) {
    console.log("✅ No extra keys found!\n")
  }

  // Report duplicate keys
  let hasDuplicateKeys = false
  for (const locale of SUPPORTED_LOCALES) {
    if (analysis.duplicateKeys[locale] && analysis.duplicateKeys[locale].length > 0) {
      hasDuplicateKeys = true
      console.log(`🔄 Duplicate keys in ${locale}:`)
      analysis.duplicateKeys[locale].forEach((key) => {
        console.log(`   - ${key}`)
      })
      console.log()
    }
  }

  if (!hasDuplicateKeys) {
    console.log("✅ No duplicate keys found!\n")
  }

  // Summary
  console.log("=== Summary ===")
  const totalMissing = Object.values(analysis.missingKeys).reduce((sum, keys) => sum + keys.length, 0)
  const totalExtra = Object.values(analysis.extraKeys).reduce((sum, keys) => sum + keys.length, 0)
  const totalDuplicates = Object.values(analysis.duplicateKeys).reduce((sum, keys) => sum + (keys?.length || 0), 0)

  console.log(`Missing keys: ${totalMissing}`)
  console.log(`Extra keys: ${totalExtra}`)
  console.log(`Duplicate keys: ${totalDuplicates}`)

  if (totalMissing === 0 && totalExtra === 0 && totalDuplicates === 0) {
    console.log("\n🎉 All translation files are in sync!")
    process.exit(0)
  } else {
    console.log("\n❌ Translation files need attention.")
    process.exit(1)
  }
}

function main() {
  console.log('🔍 Checking i18n translation keys...\n')
  
  // Load all translation bundles
  const bundles: Record<string, TranslationBundle> = {}
  const flattenedKeys: Record<string, string[]> = {}
  
  for (const locale of SUPPORTED_LOCALES) {
    console.log(`📖 Loading ${locale} translations...`)
    bundles[locale] = loadTranslationBundle(locale)
    flattenedKeys[locale] = flattenKeys(bundles[locale]).sort()
  }
  
  console.log('\n📊 Translation Statistics:')
  for (const locale of SUPPORTED_LOCALES) {
    console.log(`  ${locale}: ${flattenedKeys[locale].length} keys`)
  }
  
  // Check for missing keys in non-base locales
  const baseKeys = flattenedKeys['en']
  let hasErrors = false
  
  console.log('\n🔍 Checking for missing keys...')
  
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === 'en') continue
    
    const missingKeys = findMissingKeys(baseKeys, flattenedKeys[locale])
    const extraKeys = findExtraKeys(baseKeys, flattenedKeys[locale])
    
    if (missingKeys.length > 0) {
      hasErrors = true
      console.log(`\n❌ Missing keys in ${locale} (${missingKeys.length}):`)
      missingKeys.forEach(key => console.log(`  - ${key}`))
    }
    
    if (extraKeys.length > 0) {
      console.log(`\n⚠️ Extra keys in ${locale} (${extraKeys.length}):`)
      extraKeys.forEach(key => console.log(`  + ${key}`))
    }
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`✅ ${locale}: All keys match base locale`)
    }
  }
  
  // Check for duplicate keys within each locale
  console.log('\n🔍 Checking for duplicate keys...')
  for (const locale of SUPPORTED_LOCALES) {
    const keys = flattenedKeys[locale]
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    
    if (duplicates.length > 0) {
      hasErrors = true
      console.log(`\n❌ Duplicate keys in ${locale}:`)
      [...new Set(duplicates)].forEach(key => console.log(`  - $key`))
    }
  }
  
  // Summary\
  console.log('\n📋 Summary:')
  if (hasErrors) {
    console.log('❌ Translation validation failed! Please fix the issues above.')
    process.exit(1)
  } else {
    console.log('✅ All translation files are valid and synchronized!')
  }
}

// Main execution
if (require.main === module) {
  try {
    const analysis = analyzeTranslationKeys()
    generateReport(analysis)
  } catch (error) {
    console.error('Error during i18n key analysis:', error)
    process.exit(1)
  }
}

export { analyzeTranslationKeys, generateReport }
