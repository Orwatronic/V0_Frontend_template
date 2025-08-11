# Application Shell & Core Navigation - To-Do List

This document tracks the implementation of the core application shell, which provides the main layout, navigation, and context for all authenticated modules.

## Phase 1: Foundational Shell (Complete)

-   [x] **`AuthContext`:** Create a global context for managing user session, token, and company info.
-   [x] **`ProtectedRoute` Component:** Implement a wrapper to protect routes and redirect unauthenticated users.
-   [x] **`AppShell` Component:** Build the main layout with a persistent sidebar and header.
-   [x] **Sidebar Navigation:** Implement static navigation links for all core modules.
-   [x] **Header:** Add user menu with profile info and logout functionality.
-   [x] **Breadcrumbs:** Create a dynamic breadcrumb component based on the current route.
-   [x] **Integration:** Wrap all module pages (`/dashboard`, `/financial`, etc.) with the `AppShell`.
-   [x] **Company Context Switcher:** Implement a dropdown in the header to switch between user-accessible companies.
-   [x] **Notifications Panel:** Build a slide-out panel for real-time system notifications.
-   [x] **Global Search:** Add a global search bar to the header for quick access to data across modules.

## Phase 2: Advanced Features (In Progress)

-   [x] **Role-Based Access Control (RBAC):** Adapt sidebar and component visibility based on user roles and permissions.
-   [x] **Theming:** Implement a theme switcher (light/dark mode) in the user settings.
-   [ ] **Internationalization (i18n):** Add a language switcher to the header and integrate with `i18next`.
-   [ ] **Real-time Updates:** Use WebSockets to push updates to the notifications panel and other relevant UI elements.

## // API Endpoints for CURSOR

### Authentication & User
\`\`\`typescript
// Fetch current user details for header/profile
GET /api/v1/users/me

// Fetch list of companies accessible by the user
GET /api/v1/users/me/companies

// Fetch user roles and permissions
GET /api/v1/users/me/permissions

// Invalidate user session on the backend
POST /api/v1/auth/logout
\`\`\`

### Notifications
\`\`\`typescript
// Fetch unread notifications for the bell icon/panel
GET /api/v1/notifications?status=unread

// Mark a notification as read
PATCH /api/v1/notifications/{notificationId}
\`\`\`

### Search
\`\`\`typescript
// Global search across all modules
GET /api/v1/search?q={query}
\`\`\`
