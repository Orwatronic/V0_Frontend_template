#!/usr/bin/env node

/**
 * i18n Scan and Merge Script
 * Scans for missing translation keys and appends placeholders without overwriting existing values.
 *
 * Usage:
 *   node scripts/i18n-scan-and-merge.js       # Dry run, creates i18n-report.json
 *   node scripts/i18n-scan-and-merge.js --apply   # Applies missing keys to locale files
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const localesDir = path.join(__dirname, "..", "locales");
const languages = {
  en: "__MISSING_TRANSLATION__",
  ar: "__مفقود__",
  no: "__MANGLER__"
};

function isSkippableKey(key) {
  if (!key || typeof key !== "string") return true;
  const trimmed = key.trim();
  if (!trimmed) return true;
  // Skip template-literal style keys and obvious non-i18n tokens
  if (trimmed.includes("${")) return true;
  // Enforce namespaced keys like module.section.item
  if (!trimmed.includes(".")) return true;
  // Skip punctuation/whitespace-like tokens
  if (/^[\s\.,\/@\-]+$/.test(trimmed)) return true;
  return false;
}

function getAllI18nKeys() {
  const files = glob.sync("**/*.{js,jsx,ts,tsx}", {
    ignore: [
      "node_modules/**",
      ".next/**",
      "components/test/**",
      "public/**",
      "scripts/**",
      "app/api/**"
    ]
  });

  const keyRegex = /t\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const keys = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  });

  return Array.from(keys);
}

function loadLocale(filePath) {
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : {};
}

function saveLocale(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function ensureKey(obj, key, placeholder) {
  const parts = key.split(".");
  let ref = obj;
  parts.forEach((part, i) => {
    if (!ref[part]) {
      ref[part] = i === parts.length - 1 ? placeholder + " " + key : {};
    }
    ref = ref[part];
  });
}

function run(applyChanges) {
  const allKeys = getAllI18nKeys();
  const skippedKeys = new Set();
  const consideredKeys = allKeys.filter((k) => {
    const skip = isSkippableKey(k);
    if (skip) skippedKeys.add(k);
    return !skip;
  });
  const report = { scannedKeys: allKeys.length, consideredKeys: consideredKeys.length, missing: {}, skipped: Array.from(skippedKeys) };

  Object.keys(languages).forEach(lang => {
    const filePath = path.join(localesDir, lang, "translation.json");
    const data = loadLocale(filePath);
    const missing = [];

    consideredKeys.forEach(key => {
      const parts = key.split(".");
      let ref = data;
      let exists = true;
      for (const part of parts) {
        if (!ref || !ref.hasOwnProperty(part)) {
          exists = false;
          break;
        }
        ref = ref[part];
      }
      if (!exists) {
        missing.push(key);
        if (applyChanges) {
          ensureKey(data, key, languages[lang]);
        }
      }
    });

    if (applyChanges && missing.length > 0) {
      saveLocale(filePath, data);
    }

    report.missing[lang] = missing;
  });

  fs.writeFileSync(
    path.join(__dirname, "..", "i18n-report.json"),
    JSON.stringify(report, null, 2)
  );

  console.log(
    applyChanges
      ? "✅ Missing keys added. See i18n-report.json for details."
      : "ℹ️ Dry run complete. See i18n-report.json for details."
  );
}

const apply = process.argv.includes("--apply");
run(apply);


