#!/usr/bin/env tsx

import * as fs from "fs"
import { glob } from "glob"

const COMPONENT_PATTERNS = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "contexts/**/*.{ts,tsx}",
  "hooks/**/*.{ts,tsx}",
]

const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/*.d.ts",
  "**/scripts/**",
  "**/lib/i18n.ts", // Allow hardcoded strings in i18n utilities
]

// Patterns that indicate hardcoded user-facing strings
const HARDCODED_STRING_PATTERNS = [
  // JSX text content
  />\s*["']([^"'<>{}]+)["']\s*</g,
  // JSX attributes with user-facing text
  /(?:placeholder|title|alt|aria-label|aria-describedby)\s*=\s*["']([^"'{}]+)["']/g,
  // String literals in JSX
  />\s*([A-Z][^<>{}]*[a-z][^<>{}]*)\s*</g,
]

const ALLOWED_PATTERNS = [
  // Technical strings that don't need translation
  /^[a-z-]+$/, // CSS classes, HTML attributes
  /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/, // CSS values
  /^#[0-9a-fA-F]{3,8}$/, // Color codes
  /^https?:\/\//, // URLs
  /^\/[a-z0-9-/]*$/, // Paths
  /^[A-Z_][A-Z0-9_]*$/, // Constants
  /^\w+\.\w+/, // Object properties
  /^[a-z][a-zA-Z0-9]*$/, // camelCase identifiers
]

const COMMON_TECHNICAL_WORDS = [
  "div",
  "span",
  "button",
  "input",
  "form",
  "table",
  "tr",
  "td",
  "th",
  "className",
  "onClick",
  "onChange",
  "onSubmit",
  "type",
  "id",
  "key",
  "children",
  "props",
  "state",
  "ref",
  "style",
  "data",
  "aria",
  "role",
  "px",
  "rem",
  "em",
  "auto",
  "none",
  "block",
  "flex",
  "grid",
  "center",
  "left",
  "right",
  "top",
  "bottom",
  "width",
  "height",
  "margin",
  "padding",
]

function isAllowedString(str: string): boolean {
  // Check if it's a technical string that doesn't need translation
  if (ALLOWED_PATTERNS.some((pattern) => pattern.test(str))) {
    return true
  }

  // Check if it's a common technical word
  if (COMMON_TECHNICAL_WORDS.includes(str.toLowerCase())) {
    return true
  }

  // Check if it's very short (likely technical)
  if (str.length <= 2) {
    return true
  }

  // Check if it contains only numbers and common separators
  if (/^[\d\s.,:-]+$/.test(str)) {
    return true
  }

  return false
}

function checkFileForHardcodedStrings(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8")
  const issues: string[] = []

  // Skip files that are likely configuration or utility files
  if (filePath.includes(".config.") || filePath.includes("utils.ts")) {
    return issues
  }

  const lines = content.split("\n")

  lines.forEach((line, lineNumber) => {
    // Skip comments and imports
    if (
      line.trim().startsWith("//") ||
      line.trim().startsWith("/*") ||
      line.trim().startsWith("*") ||
      line.trim().startsWith("import ") ||
      line.trim().startsWith("export ")
    ) {
      return
    }

    // Look for potential hardcoded strings
    const stringMatches = line.match(/["']([^"']+)["']/g)

    if (stringMatches) {
      stringMatches.forEach((match) => {
        const str = match.slice(1, -1) // Remove quotes

        // Skip if it's an allowed string
        if (isAllowedString(str)) {
          return
        }

        // Check if it looks like user-facing text
        if (/^[A-Z]/.test(str) && str.length > 3 && /[a-z]/.test(str)) {
          // Check if it's already using i18n (contains t( or similar)
          if (!line.includes("t(") && !line.includes("t.")) {
            issues.push(`Line ${lineNumber + 1}: "${str}"`)
          }
        }
      })
    }
  })

  return issues
}

async function main() {
  console.log("🔍 Checking for hardcoded user-facing strings...\n")

  // Find all component files
  const files: string[] = []
  for (const pattern of COMPONENT_PATTERNS) {
    const matches = await glob(pattern, { ignore: EXCLUDE_PATTERNS })
    files.push(...matches)
  }

  console.log(`📁 Checking ${files.length} files...\n`)

  let totalIssues = 0
  const fileIssues: Record<string, string[]> = {}

  for (const file of files) {
    const issues = checkFileForHardcodedStrings(file)
    if (issues.length > 0) {
      fileIssues[file] = issues
      totalIssues += issues.length
    }
  }

  // Report results
  if (totalIssues === 0) {
    console.log("✅ No hardcoded user-facing strings found!")
  } else {
    console.log(`❌ Found ${totalIssues} potential hardcoded strings:\n`)

    Object.entries(fileIssues).forEach(([file, issues]) => {
      console.log(`📄 ${file}:`)
      issues.forEach((issue) => console.log(`  ${issue}`))
      console.log()
    })

    console.log("💡 Consider using the i18n system for user-facing text:")
    console.log("   const { t } = useI18n()")
    console.log('   <span>{t("your.translation.key")}</span>')

    if (process.env.CI) {
      process.exit(1)
    }
  }
}

if (require.main === module) {
  main().catch(console.error)
}
