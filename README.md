# Feebee Technologies - Enterprise ERP Frontend

*A comprehensive, cloud-native Enterprise Resource Planning system built with Next.js, TypeScript, and Tailwind CSS*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/orwahs-projects/v0-enterprise-erp-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/pEMRAVIM7c0)

## 🎯 Project Overview

This repository contains the frontend implementation of Feebee Technologies' Enterprise ERP system. The project provides a modern, scalable, and user-friendly interface for comprehensive business process management across all enterprise departments.

### **Technology Stack**
- **Frontend**: Next.js 14.2.16 + TypeScript + Tailwind CSS
- **Components**: shadcn/ui + Lucide React icons
- **Authentication**: JWT with multi-company support
- **Internationalization**: Multi-language support (EN, AR, NO)
- **Deployment**: Vercel with automatic CI/CD

### **Backend Integration (Planned)**
- This frontend will connect to a backend later. Until then, certain flows (e.g., auth) use mock implementations.
- API endpoints will be configured via environment variables. Example:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

When the backend is ready, replace mock calls in `lib/auth.ts` and wire API calls through a typed client.

## 📊 Current Status

**Last Updated: 2025-08-14**

The UI foundation (providers, styling, i18n, and many module pages/components) is in place. Backend integration is planned and not yet wired; some features use mock data until the API is available.

### **Phase 1: Core Modules**
- ✅ Application shell & providers
- 🟡 Authentication (mocked; will be wired to backend later)
- 🟡 Module UIs present (wiring to APIs pending)
- 📋 Human Capital Management: Planned
- 📋 Organizational Management: Planned

### **Phase 2: Advanced Features**
- 🟡 Analytics & dashboards (components available; data wiring pending)
- 🟡 Customer portal UI present
- 📋 Real-time notifications: Planned
- 📋 Workflow engine: Planned

### **Phase 3: AI-Powered Features** - 🔴 Planned
- 📋 Predictive Analytics
- 📋 Intelligent Automation
- 📋 Natural Language Processing

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-repo/feebee-erp-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

\`\`\`bash
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   ├── modules/           # Business module components
│   └── shared/            # Shared components
├── lib/                   # Utility functions
├── locales/               # Internationalization files
├── public/                # Static assets
└── Planning and progress tracking/  # Project planning docs
\`\`\`

## 🔧 Development

### **For Backend Integration (CURSOR)**
See detailed integration guide in `Planning and progress tracking/cursor-integration-guide.md`

### **Component Development**
- Follow TypeScript strict mode
- Use shadcn/ui components
- Implement responsive design
- Add internationalization support

## 📋 Planning & Documentation

Detailed planning documents are available in the `Planning and progress tracking/` folder:

- **Module-specific plans**: Individual module development roadmaps
- **Integration guides**: Backend API integration specifications
- **Design system**: UI/UX guidelines and component standards
- **Testing strategy**: Comprehensive testing approach

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow coding standards and conventions
3. Write tests for new features
4. Submit pull request with detailed description

## 📞 Contact & Support

- **Repository**: [GitHub Repository](https://github.com/your-repo)
- **Live Demo**: [Vercel Deployment](https://your-domain.vercel.app)
- **Documentation**: See `Planning and progress tracking/` folder

---

**Version**: 1.0.0 | **Status**: Active Development | **Last Updated**: January 2024
