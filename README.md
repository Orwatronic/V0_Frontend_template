# Feebee Technologies - Enterprise ERP Frontend

*A comprehensive, cloud-native Enterprise Resource Planning system built with Next.js, TypeScript, and Tailwind CSS*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/orwahs-projects/v0-enterprise-erp-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/pEMRAVIM7c0)

## 🎯 Project Overview

This repository contains the frontend implementation of Feebee Technologies' Enterprise ERP system. The project provides a modern, scalable, and user-friendly interface for comprehensive business process management across all enterprise departments.

### **Technology Stack**
- **Frontend**: Next.js 14.2.16 + TypeScript + Tailwind CSS
- **Components**: shadcn/ui + Lucide React icons
- **Auth (current)**: Mock-first via `AuthProvider`; planned JWT + refresh tokens and server-driven permissions
- **Internationalization**: Multi-language support (EN, AR, NO), RTL, pseudo-locale
- **Deployment**: Vercel with automatic CI/CD

### **Backend Integration (Planned)**
- Local Next.js API routes proxy to the backend when available, with graceful fallbacks for development.
- Configure endpoints via environment variables. Example:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
API_BASE_URL=http://localhost:3001
```

When the backend is ready, disable mock auth and rely on the typed Axios client (`lib/api-client.ts`) + server-driven permissions.

## 📊 Current Status

**Last Updated: 2025-08-17**

Foundation (providers, styling, i18n, security headers) is in place. Many modules are wired via local Next.js API routes with fallbacks, so the app runs without a backend and can proxy when one is available.

### **Current Frontend Parity (no backend required)**
- CRM: Dashboard (SSE), Leads/Accounts/Contacts, Opportunities Kanban, local proxy routes
- Financials: AP/AR lists via local routes; AP/AR detail pages with editable status
- HCM: Employees list via local route + detail page; Recruitment pipeline (drag/drop) wired to local routes; Interactive Org Chart with collapse/expand
- Materials: Material Master fetch by category; Warehouse schema (data-driven) + admin editor; Warehouse map consumes schema
- MDM: Customer Master list + details via local routes
- Organizational Management: Units list via local route + detail page; KPIs/audit mocked
- Quality: Inspections list via local route + detail page
- Projects & Plant Maintenance: Lists + details via local routes

### **Planned Next**
- Auth/RBAC v1 (real login/refresh, server-driven permissions)
- Expand tests/a11y; unify list/table UX across modules
- Analytics & dashboards wiring; Customer Portal backend wiring

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/feebee-erp-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure (high level)

```bash
app/
  api/                    # Local Next.js route handlers (proxies with fallbacks)
  crm/, financial/, employees/, materials/, mdm/, org-management/, plant-maintenance/, production/, project-system/, quality/, reports/
components/
  ui/, analytics/, ...    # shadcn/ui primitives + module components
contexts/                 # Auth and i18n providers
hooks/                    # use-api, use-permissions, use-toast, use-ui-store
lib/                      # api-client, auth, i18n, utils
locales/                  # en, ar, no translation bundles
tests/                    # Vitest config and smoke tests
```

## 🔧 Development

### **For Backend Integration**
See `PROJECT_REFERENCE.md` (authoritative) and `project_status.md` for status and endpoints.

### **Component Development**
- Follow TypeScript strict mode
- Use shadcn/ui components
- Implement responsive design
- Add internationalization support

## 📋 Planning & Documentation

- `PROJECT_REFERENCE.md`: Single source of truth for modules, files, and endpoints
- `project_status.md`: Verified progress and parity plan
- `Planning and progress tracking/`: Additional plans and prompts

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow coding standards and conventions
3. Write tests for new features
4. Submit pull request with detailed description

## 📞 Contact & Support

- **Repository**: [GitHub Repository](https://github.com/your-repo)
- **Live Demo**: [Vercel Deployment](https://your-domain.vercel.app)
- **Documentation**: See `PROJECT_REFERENCE.md` and `project_status.md`

---

**Version**: 0.9.x | **Status**: Active Development | **Last Updated**: 2025-08-17
