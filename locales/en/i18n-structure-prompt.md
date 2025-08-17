## Feebee ERP — Internationalization Structuring Prompt (for future-self)

You are working in the repository `V0_Frontend_template_i18n_120825` using Cursor. Your mission is to: 

1) Define a canonical, systematic structure for `locales/en/translation.json` (the source-of-truth). 
2) Replicate the exact structure (keys and ordering) into `locales/ar/translation.json` and `locales/no/translation.json`. 
3) Preserve all existing keys and values; merge them into the new structure without deletion. If duplicates exist, keep existing values and place additional references under the new schema as needed.

Important constraints
- Do not delete or overwrite existing translations; you may relocate logically (by creating new nested keys) while keeping the original keys for backward-compat compatibility if still referenced.
- Keep JSON formatting consistent and stable (indentation, commas, quote style). 
- English (`en`) is canonical. Other locales mirror the structure with values copied (temporarily) from English or set as placeholders if a translation is intentionally pending.
- Keep paths stable and predictable; prefer nouns for sections and verbs for actions.
- Variables use double curly braces: `{{name}}`; support counts via simple plural pairs: `"item":"{{count}} item|{{count}} items"`.

Naming conventions and ordering
- Casing: lowerCamelCase for keys.
- Order: top-level domains first (app shell, marketing pages), then shared primitives, then business modules (alphabetical), then feature pages.
- Keep alphabetical ordering at each level where natural ordering is not essential; if there is a logical flow (e.g., marketing pages), place in intended UI order.

Top-level hierarchy for translation.json (canonical)
```json
{
  "app": {
    "meta": {
      "title": "Feebee ERP",
      "description": "Enterprise-grade ERP platform"
    },
    "layout": {
      "header": {
        "skipToContent": "Skip to content"
      },
      "nav": {
        "home": "Home",
        "solutions": "Solutions",
        "pricing": "Pricing",
        "testimonials": "Testimonials",
        "login": "Login",
        "logout": "Logout",
        "dashboard": "Dashboard"
      },
      "footer": {
        "copyright": "© {{year}} Feebee Technologies"
      }
    },
    "landing": {
      "hero": {
        "title": "Modern Enterprise ERP",
        "subtitle": "Unify financials, operations, and people on a single platform",
        "primaryCta": "Get Started",
        "secondaryCta": "Request Demo"
      },
      "features": {
        "title": "Why Feebee",
        "items": {
          "scalability": {
            "title": "Scalability",
            "desc": "Built for growth across regions and teams"
          },
          "security": {
            "title": "Security",
            "desc": "Defense-in-depth with modern standards"
          },
          "performance": {
            "title": "Performance",
            "desc": "Fast experiences for data-heavy workflows"
          }
        }
      },
      "pricing": {
        "title": "Pricing",
        "subtitle": "Choose a plan that fits your organization"
      },
      "testimonials": {
        "title": "What our customers say"
      }
    }
  },

  "common": {
    "actions": {
      "save": "Save",
      "cancel": "Cancel",
      "edit": "Edit",
      "delete": "Delete",
      "search": "Search",
      "close": "Close",
      "next": "Next",
      "back": "Back"
    },
    "status": {
      "open": "Open",
      "closed": "Closed",
      "inProgress": "In Progress",
      "active": "Active",
      "inactive": "Inactive"
    },
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Enter a valid email address"
    },
    "a11y": {
      "loading": "Loading",
      "error": "An error occurred"
    }
  },

  "auth": {
    "login": {
      "title": "Sign in",
      "subtitle": "Access your Feebee account",
      "email": "Work email",
      "password": "Password",
      "company": "Company",
      "signIn": "Sign in",
      "loading": "Signing in…",
      "forgotPassword": "Forgot password?",
      "mfa": {
        "title": "Two-factor authentication",
        "subtitle": "Enter the 6‑digit code",
        "codeLabel": "Verification code",
        "verify": "Verify",
        "back": "Back"
      },
      "deviceTrust": {
        "title": "Trust this device",
        "description": "We will reduce extra verification on this device"
      },
      "errors": {
        "generic": "Could not complete sign in",
        "emailInvalid": "Please enter a valid email"
      },
      "aria": {
        "errorRegion": "Login error messages",
        "togglePasswordShow": "Show password",
        "togglePasswordHide": "Hide password"
      }
    }
  },

  "modules": {
    "dashboard": {
      "title": "Dashboard"
    },
    "crm": {
      "title": "Customer Relationship Management",
      "customer360": {
        "title": "Customer 360"
      }
    },
    "financial": {
      "chartOfAccounts": {
        "title": "Chart of Accounts",
        "description": "Account hierarchy and balances",
        "columns": {
          "accountName": "Account name",
          "accountNumber": "Account number",
          "type": "Type",
          "balance": "Balance"
        },
        "aria": {
          "accountTree": "Account tree",
          "searchLabel": "Search accounts",
          "expandButton": "Expand {{name}}",
          "collapseButton": "Collapse {{name}}"
        },
        "accountTypes": {
          "Header": "Header",
          "Asset": "Asset",
          "Liability": "Liability",
          "Equity": "Equity",
          "Revenue": "Revenue",
          "Expense": "Expense"
        },
        "searchPlaceholder": "Search by name or number",
        "addAccount": "Add account",
        "loading": "Loading accounts"
      },
      "journalEntries": {
        "title": "Journal Entries",
        "description": "Review and manage journal entries",
        "columns": {
          "entryNumber": "Entry #",
          "date": "Date",
          "description": "Description",
          "debit": "Debit",
          "credit": "Credit"
        },
        "searchPlaceholder": "Search entries",
        "loading": "Loading journal entries",
        "errors": {
          "loadFailed": "Failed to load journal entries"
        }
      },
      "accountsPayable": {
        "title": "Accounts Payable",
        "description": "Vendor invoices and payment runs",
        "searchPlaceholder": "Search invoices",
        "columns": {
          "invoiceNumber": "Invoice #",
          "vendor": "Vendor",
          "issueDate": "Issue date",
          "dueDate": "Due date",
          "amount": "Amount"
        },
        "metrics": {
          "total": "Total due",
          "overdue": "Overdue",
          "upcoming": "Upcoming"
        },
        "invoicesLabel": "invoices",
        "loading": "Loading payable invoices",
        "errors": { "loadFailed": "Failed to load payable invoices" }
      },
      "accountsReceivable": {
        "title": "Accounts Receivable",
        "description": "Customer invoices and collections",
        "searchPlaceholder": "Search invoices",
        "columns": {
          "invoiceNumber": "Invoice #",
          "customer": "Customer",
          "issueDate": "Issue date",
          "dueDate": "Due date",
          "amount": "Amount"
        },
        "metrics": {
          "outstanding": "Outstanding",
          "overdue": "Overdue",
          "avgCollection": "Avg. collection"
        },
        "daysLabel": "days",
        "loading": "Loading receivables",
        "errors": { "loadFailed": "Failed to load receivables" }
      },
      "bankRec": {
        "title": "Bank Reconciliation",
        "description": "Match bank statements to GL entries",
        "date": "Date",
        "descriptionCol": "Description",
        "amount": "Amount",
        "selectedBankTotal": "Selected bank total",
        "selectedGlTotal": "Selected GL total",
        "difference": "Difference",
        "uploadStatement": "Upload statement",
        "matchSelected": "Match selected",
        "createAdjustingEntry": "Create adjusting entry",
        "toastTitle": "Reconciliation",
        "toastDescription": "Matched {{bank}} bank and {{gl}} GL items",
        "loading": "Loading reconciliation",
        "errors": { "loadFailed": "Failed to load reconciliation", "matchFailed": "Match failed" }
      },
      "assets": {
        "title": "Asset Accounting",
        "description": "Track fixed assets and depreciation",
        "metrics": {
          "totalAssetValue": "Total asset value",
          "totalAssetValueDesc": "Acquisition cost of all assets",
          "accumDepreciation": "Accumulated depreciation",
          "accumDepreciationDesc": "Depreciation to date",
          "netBookValue": "Net book value",
          "netBookValueDesc": "Value after depreciation"
        },
        "register": {
          "title": "Asset register",
          "description": "Asset list and values"
        },
        "form": {
          "description": "Description",
          "assetClass": "Asset class",
          "acquisitionCost": "Acquisition cost"
        },
        "actions": {
          "addAsset": "Add asset",
          "saveAsset": "Save asset",
          "runMonthly": "Run monthly depreciation"
        },
        "dialog": {
          "addTitle": "Add asset",
          "addDesc": "Provide asset details"
        },
        "table": {
          "assetId": "Asset ID",
          "description": "Description",
          "assetClass": "Asset class",
          "acquisitionCost": "Acquisition cost",
          "netBookValue": "Net book value",
          "acquisitionDate": "Acquisition date"
        },
        "loading": "Loading assets",
        "errors": { "loadFailed": "Failed to load assets", "runFailed": "Depreciation failed" },
        "toast": {
          "startTitle": "Depreciation initiated",
          "startDesc": "Processing monthly depreciation",
          "completeTitle": "Depreciation complete",
          "completeDesc": "Asset values updated"
        }
      },
      "reporting": {
        "title": "Financial Reporting",
        "description": "P&L and balance sheet",
        "dateRange": "Select date range",
        "export": "Export",
        "accountColumn": "Account",
        "amountColumn": "Amount",
        "pnl": {
          "revenue": "Revenue",
          "cogs": "Cost of goods sold",
          "grossProfit": "Gross profit",
          "operatingExpenses": "Operating expenses",
          "marketing": "Marketing",
          "sales": "Sales",
          "admin": "Admin",
          "netIncome": "Net income"
        },
        "balanceSheet": {
          "assets": "Assets",
          "currentAssets": "Current assets",
          "cash": "Cash",
          "accountsReceivable": "Accounts receivable",
          "inventory": "Inventory",
          "fixedAssets": "Fixed assets",
          "ppe": "Property, plant and equipment",
          "liabilities": "Liabilities",
          "currentLiabilities": "Current liabilities",
          "accountsPayable": "Accounts payable",
          "longTermLiabilities": "Long-term liabilities",
          "longTermDebt": "Long-term debt",
          "equity": "Equity",
          "totalLiabilitiesEquity": "Total liabilities and equity"
        },
        "loading": "Loading financial reports",
        "errors": { "loadFailed": "Failed to load financial reports" }
      }
    },

    "materials": { "title": "Materials Management" },
    "hcm": { "title": "Human Capital Management" },
    "mdm": { "title": "Master Data Management" },
    "production": { "title": "Production" },
    "maintenance": { "title": "Plant Maintenance" },
    "quality": {
      "title": "Quality Management",
      "description": "Inspections, non-conformances, and corrective actions.",
      "search": "Search inspections...",
      "searchAria": "Search inspections",
      "date": "Date",
      "status": "Status",
      "descriptionCol": "Description",
      "loading": "Loading",
      "errors": { "loadFailed": "Failed to load inspections" }
    },
    "projects": {
      "title": "Project System",
      "description": "Projects, WBS elements, and progress tracking.",
      "search": "Search projects...",
      "searchAria": "Search projects",
      "name": "Name",
      "manager": "Manager",
      "status": "Status",
      "loading": "Loading",
      "errors": { "loadFailed": "Failed to load projects" }
    },
    "org": {
      "title": "Organizational Management",
      "description": "Manage organizations, roles, cost centers, and hierarchies.",
      "search": "Search org units...",
      "searchAria": "Search organizational units",
      "name": "Name",
      "costCenters": "Cost Centers",
      "status": "Status",
      "loading": "Loading",
      "errors": { "loadFailed": "Failed to load organizational units" }
    }
  }
}
```

Replication for `ar` and `no`
- Mirror the structure 1:1. Keys and ordering must be identical.
- For `ar` (RTL): ensure text still reads correctly; do not add punctuation mirroring in keys; UI layout direction is handled by the app (dir=rtl). If a translation does not exist yet, temporarily copy the English value and mark in a TODO list.
- For `no`: copy English values if translations are pending.

Execution plan
1. Read current `locales/en/translation.json`, `locales/ar/translation.json`, and `locales/no/translation.json`.
2. Create a staging object in memory following the canonical schema above.
3. Migrate existing keys by best-fit matching (e.g., chart-of-accounts → modules.financial.chartOfAccounts) without deleting original keys yet.
4. Write out the new `en` JSON in-place, preserving indentation and stable key ordering.
5. For `ar` and `no`, write the same structure and copy over existing values if present; otherwise, insert English values temporarily.
6. Do not remove old keys in this pass. Open a follow-up task to replace code references to old paths, then clean up.
7. Validate by running the i18n checks (hardcoded strings and missing keys) and smoke test pages.
8. Commit on a dedicated branch, e.g., `i18n-structure-YYYYMMDD`, and open a PR with a concise summary of moved/added key paths.

Quality bar
- No raw keys should render after this pass (fallbacks allowed temporarily).
- No existing translation values should be lost.
- The file should be human-scannable, with predictable, intuitive nesting aligned to the app’s IA.

Notes
- If a key is referenced frequently across modules, place it under `common/` to avoid duplication.
- Keep labels, ARIA strings, and validation messages close to their usage domains when specific; otherwise place in `common`.


