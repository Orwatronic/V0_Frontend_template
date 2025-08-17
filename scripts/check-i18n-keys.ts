#!/usr/bin/env tsx

import * as fs from "fs"
import * as path from "path"

interface TranslationBundle {
  [key: string]: any
}

const LOCALES_DIR = path.join(process.cwd(), "locales")
const SUPPORTED_LOCALES = ["en", "ar", "no"]
const BASE_LOCALE = "en"

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

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey))
    } else {
      keys.push(fullKey)
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
  const baseKeys = flattenedKeys[BASE_LOCALE]
  let hasErrors = false
  
  console.log('\n🔍 Checking for missing keys...')
  
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === BASE_LOCALE) continue
    
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
  \
  // Summary
  console.log('\n📋 Summary:')
  if (hasErrors) {
    console.log('❌ Translation validation failed! Please fix the issues above.')
    process.exit(1)
  } else {
    console.log('✅ All translation files are valid and synchronized!')
  }
}

if (require.main === module) {
  main()
}
