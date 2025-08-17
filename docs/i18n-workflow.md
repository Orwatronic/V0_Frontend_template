# Internationalization (i18n) Workflow

This document outlines the translation management workflow for the Feebee ERP system.

## Overview

Our i18n system supports multiple languages with a focus on:
- **English (en)** - Base locale and source of truth
- **Arabic (ar)** - RTL support with proper Arabic translations
- **Norwegian (no)** - Norwegian business terminology

## Translation Files Structure

\`\`\`
locales/
├── en/
│   └── translation.json    # Base locale (source of truth)
├── ar/
│   └── translation.json    # Arabic translations
└── no/
    └── translation.json    # Norwegian translations
\`\`\`

## Development Workflow

### 1. Adding New Translation Keys

1. **Always add keys to English first** (`locales/en/translation.json`)
2. Use hierarchical key structure: `module.component.element`
3. Follow naming conventions:
   \`\`\`json
   {
     "financial": {
       "accountsPayable": {
         "title": "Accounts Payable",
         "columns": {
           "invoiceNumber": "Invoice #",
           "vendor": "Vendor"
         }
       }
     }
   }
   \`\`\`

### 2. Using Translations in Components

\`\`\`tsx
import { useI18n } from "@/contexts/i18n-context"

export function MyComponent() {
  const { t, formatters } = useI18n()
  
  return (
    <div>
      <h1>{t("financial.accountsPayable.title")}</h1>
      <p>{formatters.formatCurrency(1000, "USD")}</p>
    </div>
  )
}
\`\`\`

### 3. Pluralization

Use the pipe syntax for simple pluralization:

\`\`\`json
{
  "items": "{{count}} item|{{count}} items"
}
\`\`\`

\`\`\`tsx
// Usage
t("items", { count: 1 }, 1)  // "1 item"
t("items", { count: 5 }, 5)  // "5 items"
\`\`\`

## Quality Assurance

### Automated Checks

Run these commands before committing:

\`\`\`bash
# Check for missing translation keys
npm run i18n:check-keys

# Check for hardcoded strings
npm run i18n:check-strings

# Run both checks
npm run i18n:validate
\`\`\`

### Manual Testing

1. **Pseudo-locale testing**: Add `?pseudo=true` to URL or select "Pseudo (Test)" in language switcher
2. **RTL testing**: Switch to Arabic and verify layout mirroring
3. **Content length testing**: Ensure UI handles longer translations

## Translation Guidelines

### English (Base Locale)
- Use clear, concise business terminology
- Avoid technical jargon in user-facing text
- Use sentence case for labels
- Use title case for headings

### Arabic
- Use formal Arabic (Modern Standard Arabic)
- Ensure proper RTL text flow
- Use appropriate business terminology
- Consider cultural context for financial terms

### Norwegian
- Use Norwegian business terminology
- Prefer Bokmål over Nynorsk
- Use appropriate formal language for business context

## CI/CD Integration

### Pre-commit Hooks
- Translation key validation
- Hardcoded string detection

### Build Pipeline
- Translation completeness check
- Pseudo-locale generation for testing
- RTL layout validation

## Translation Freeze Process

### Before Release
1. **Translation Freeze**: No new keys 2 weeks before release
2. **Translation Review**: All translations reviewed by native speakers
3. **QA Testing**: Full i18n testing across all supported locales
4. **Sign-off**: Product and localization teams approve

### Emergency Translations
- Critical fixes can bypass freeze with approval
- Must include translations for all supported locales
- Requires immediate QA validation

## Tools and Resources

### Development Tools
- **Pseudo-locale**: `?pseudo=true` for UI testing
- **Missing key warnings**: Console warnings in development
- **Translation validation**: `npm run i18n:validate`

### External Tools
- Translation Management System (TMS) integration (future)
- Professional translation services
- Community translation platform (future)

## Troubleshooting

### Common Issues

1. **Missing translation key**
   - Check console for warnings
   - Add key to base locale first
   - Run `npm run i18n:check-keys`

2. **Hardcoded strings**
   - Run `npm run i18n:check-strings`
   - Replace with `t("key")` calls
   - Add appropriate translation keys

3. **RTL layout issues**
   - Test with Arabic locale
   - Check CSS for RTL-specific styles
   - Verify icon and layout mirroring

4. **Pluralization not working**
   - Use pipe syntax: `"singular|plural"`
   - Pass count parameter: `t("key", vars, count)`
   - Test with different count values

## Best Practices

1. **Never hardcode user-facing strings**
2. **Always test with pseudo-locale**
3. **Consider text expansion (30-50% longer in other languages)**
4. **Use semantic HTML for screen readers**
5. **Provide meaningful alt text for images**
6. **Test keyboard navigation in RTL**
7. **Use appropriate date/number formatting**
8. **Keep translation keys descriptive and hierarchical**
