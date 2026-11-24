# 15 — Project Handover

## 1. Handover Summary
This document provides all information necessary for a new developer or team to take over the CONSOL website redesign project.

## 2. Repository & Access

| Item | Detail |
|------|--------|
| Project root | `consol-redesgin/` |
| Frontend | `frontend/` — React 19 + Vite + Tailwind CSS v4 |
| Backend | `backend/` — Laravel 11 |
| Documentation | `documentation/` — this folder |
| Original site | <https://www.constructionsolutionsplc.com/> |

## 3. Current Project Status

### Completed
- ✅ Design system (colour tokens, typography, spacing, geometry)
- ✅ UI primitives (Button, Card, Badge, Input, Select, Dialog, Accordion, Tabs, Skeleton, Toaster)
- ✅ Shared components (Logo, PageHero, Breadcrumbs, Pagination, Lightbox, Reveal, ErrorBoundary)
- ✅ Site layout (SiteHeader with dropdowns + mobile drawer, SiteFooter)
- ✅ All public route definitions and code-split page components
- ✅ Homepage with all sections
- ✅ Bilingual support (English + Amharic)
- ✅ API service layer with fallback to demo data
- ✅ 25 frontend tests passing
- ✅ Production build working
- ✅ Laravel backend scaffolded

### Awaiting CONSOL Approval
- ⏳ Module 01 design review and sign-off
- ⏳ Amharic translation review for official statements
- ⏳ Client logo usage permission
- ⏳ Leadership portraits and bios
- ⏳ Course fees, schedules, instructor details
- ⏳ Privacy policy and terms of service
- ⏳ Company profile PDF
- ⏳ Business hours and office coordinates

### Not Yet Started
- ❌ Laravel API controllers and routes
- ❌ Database models and migrations (beyond users, cache, jobs)
- ❌ Admin panel backend
- ❌ Email notifications for form submissions
- ❌ Sanctum authentication integration
- ❌ Production deployment
- ❌ PHP version and hosting compatibility review
- ❌ Browser visual QA at all breakpoints

## 4. Development Environment Setup

### Prerequisites
- Node.js 18+ and npm
- PHP 8.2+ and Composer
- Laragon (recommended for Windows) or similar local server

### Frontend
```bash
cd frontend
npm install
npm run dev        # Start dev server
npm test           # Run tests
npm run build      # Production build
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve  # Start dev server at localhost:8000
```

## 5. Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Separate frontend and backend | Clean separation; frontend can be deployed to CDN independently |
| React 19 + Vite (not TanStack Start) | Approved production stack; the `frontend/` Lovable prototype is for reference only |
| Tailwind CSS v4 | Utility-first, consistent with design system tokens |
| Laravel Sanctum (not Passport/JWT) | Simplest auth for SPA with same-domain cookies |
| SQLite for development | Zero-config local development |
| Demo data fallback | Frontend always renders even without backend |
| JSON columns for arrays | Flexible schema for scope, objectives, curriculum, etc. |

## 6. Known Issues & Technical Debt
1. **PHP compatibility unverified** — hosting PHP version, MySQL version, and server config not yet confirmed.
2. **No real browser testing** — visual QA has been done via CSS inspection and automated DOM tests; Chromium was unavailable in the dev environment.
3. **`frontend/` directory** — contains the old Lovable/TanStack Start prototype; kept for reference but not part of the approved stack.
4. **Map coordinates** — the original site's map link contains `undefined`; no fabricated coordinates have been added.
5. **Admin UI** — shell exists in frontend but backend CRUD is not implemented.

## 7. Key Contacts

| Role | Contact | Notes |
|------|---------|-------|
| CONSOL Management | *To be provided* | Business decisions, content approval |
| Project Manager | *To be provided* | Coordination, timeline |
| Hosting Provider | *To be provided* | Server access, PHP/MySQL versions |

## 8. Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 01 | Project Overview | Business context, stakeholders, timeline |
| 02 | Requirements Specification | Functional and non-functional requirements |
| 03 | System Architecture | High-level architecture and communication flow |
| 04 | Final Folder Structure | Complete project directory layout |
| 05 | Design System | Colours, typography, components, accessibility |
| 06 | Database Design | Entity schema, relationships, migration plan |
| 07 | API Documentation | All REST endpoints with request/response examples |
| 08 | Frontend Documentation | React app structure, data flow, pages, build |
| 09 | Backend Documentation | Laravel app structure, models, controllers |
| 10 | Admin User Guide | How to use the admin panel |
| 11 | Security Guidelines | Authentication, validation, CORS, HTTPS, rate limiting |
| 12 | Testing Plan | Test strategy, existing tests, manual checklists |
| 13 | Deployment Guide | Server setup, build, deploy, Nginx/Apache config |
| 14 | Maintenance Guide | Backups, logs, updates, monitoring, troubleshooting |
| 15 | Project Handover | This document — status, setup, contacts, decisions |

## 9. Final Notes
- Always verify information against the original CONSOL website before publishing.
- Never fabricate statistics, client names, project details, or course information.
- All content changes require CONSOL approval before going live.
- The existing production website must remain operational until the new site is explicitly approved for launch.
