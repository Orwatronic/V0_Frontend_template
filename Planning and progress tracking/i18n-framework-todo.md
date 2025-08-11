# Internationalization (i18n) Framework — Plan and To‑Do

Context
- We must deliver a global-ready ERP with multi-language, RTL, and robust translation governance. This aligns with the Accessibility & Internationalization prompt (Prompt 23) and App Router internationalization guidance [^4]. For routing and locale handling, Next.js supports i18n patterns; we will implement a provider approach first, with an option to add locale segments later if SEO requires it [^2][^1].

Objectives
- Centralize translations with a provider, ensure RTL correctness, add a visible language switcher, and eliminate mock t() usage app-wide. Add pluralization, interpolation, and localized formatting. Provide governance for translation changes (detection, tests, and a pseudo-locale).

Phase A — Stabilize (Now)
1) Provider & State
- Add I18nProvider with locale persistence (localStorage) and html lang/dir updates. DONE.
- Expose useI18n() with t(key, vars) and dir. DONE.

2) Keys & Content Corrections
- Add landing.solutions.* keys for all locales; ensure all navigation strings exist. DONE.
- Replace mock t() in Navigation and Solutions Grid; verify keys render, not raw literals. DONE.

3) Language Switcher
- Add LanguageSwitcher to header and mobile sheet. DONE.

4) Marketing Pages
- Create /solutions/[slug] with image placeholders and translations (titles, features, alts). DONE.
- Keep all backend fetches annotated for CURSOR. DONE.

Acceptance Criteria (Phase A)
- No raw translation keys shown on landing page or nav.
- Switching language updates strings immediately and sets correct RTL/LTR.
- /solutions/[slug] pages render localized content with accessible alt text and placeholders.

Phase B — Enhance
5) Pluralization & Interpolation
- Extend t() to support plural rules or integrate ICU if needed (e.g., messageformat).
- Add interpolation for variables and placeholders (already supported in basic form).

6) Localization Utilities
- Number, date, currency, and unit formatting helpers using Intl.* APIs (locale-aware).
- Provide currency strategy defaults (e.g., organization currency) with overrides.

7) Detection & Fallbacks
- Missing-key reporter (dev-only console warnings + optional overlay).
- Pseudo-locale (e.g., “en-XA”) to visually test length/diacritics.
- Add locale fallback cascade (en → en, ar → ar).

8) QA and Tests
- Unit tests for t(), pluralization, and formatting util functions.
- Integration tests for switching language and verifying RTL mirroring of key components.

Phase C — Governance & Routing (Decision)
9) Locale Routing Strategy ADR
- Decide whether to adopt /[lang]/... segments for SEO and static generation. App Router supports per-locale variants and dynamic routing strategies; adding segments improves SEO control but increases route count [^1][^2]. Document trade-offs in an ADR and plan the migration if approved.

10) Translation Management Workflow
- Define source-of-truth for keys (JSON files, future CMS, or TMS).
- Create “translation freeze” and review gates for releases.

11) Tooling
- Create a script to diff keys across locales and fail CI when missing.
- Add linter rule to prevent hardcoded user-facing strings in components.

Risks and Mitigations
- Missing keys causing runtime leakage → introduce detection and CI checks.
- RTL regressions → add an RTL visual verification pass and snapshot diffs.
- SEO if no locale segments → document in ADR and optionally migrate to /[lang]/ routing later; Next.js supports generating per-locale variants [^1][^2].

### // API Endpoints for CURSOR
\`\`\`typescript
// Content delivery (future, optional)
GET /api/v1/i18n/locales            // List locales
GET /api/v1/i18n/translations/:lng  // Download translation bundle for a locale
POST /api/v1/i18n/track-missing     // Report missing keys from clients (dev/staging)
\`\`\`

Rollout Plan
- A0: Land Phase A (provider, keys, nav + landing fixes, marketing placeholders). This change.
- A1: Sweep repo to eliminate mock t() and hardcoded strings; add number/date formatting helpers.
- B1: Add pluralization and Intl utilities; add tests.
- C1: Author ADR for /[lang]/ routing strategy; implement if approved.

References
- Next.js i18n routing and locale strategies (Pages Router docs — principles still apply; we will adapt for App Router) [^1][^2]
- ERP Prompt: Accessibility & Internationalization requirements and governance [^4]
