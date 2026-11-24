# 01 — Project Overview

## Project Name
**CONSOL — Construction Solutions PLC Website Redesign**

## Project Description
A complete redesign of the Construction Solutions PLC corporate website (<https://www.constructionsolutionsplc.com/>). The project replaces the legacy site with a modern, performant, bilingual (English/Amharic) web application backed by a Laravel REST API.

## Business Objectives
1. **Modernise the digital presence** — replace the aging website with a responsive, accessible, mobile-first experience that reflects CONSOL's market position.
2. **Improve lead generation** — streamlined inquiry, consultation-request and training-registration forms with server-side persistence and email notification.
3. **Enable content management** — provide an authenticated admin interface for managing projects, news, events, courses and inquiries without developer intervention.
4. **Support bilingual audiences** — first-class English and Amharic language support across all public pages.
5. **Establish technical foundation** — lay the groundwork for future integrations (CRM, analytics, payment) through a clean API-first architecture.

## Stakeholders
| Role | Responsibility |
|------|---------------|
| CONSOL Management | Business requirements, content approval, final sign-off |
| Project Manager | Timeline, deliverables, communication |
| Frontend Developer(s) | React/Vite UI implementation |
| Backend Developer(s) | Laravel API, database, authentication |
| Designer | UI/UX, brand compliance |
| QA / Testers | Functional, visual and accessibility testing |

## Project Timeline
| Phase | Scope | Status |
|-------|-------|--------|
| Module 01 | Design system, navigation, layout foundation | ✅ Complete — awaiting CONSOL review |
| Module 02 | Premium homepage | Pending Module 01 approval |
| Modules 03–15 | Sequential feature modules (services, training, projects, news, events, admin, etc.) | Planned |

## Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · Vite · JavaScript · Tailwind CSS v4 · React Router |
| UI Primitives | Radix UI · class-variance-authority · Framer Motion |
| Data Fetching | TanStack React Query · Axios |
| Backend | Laravel 11 (PHP) · SQLite (dev) / MySQL (prod) |
| Authentication | Laravel Sanctum (cookie-based SPA auth) |
| Testing | Vitest (frontend) · PHPUnit (backend) |

## Key Constraints
- The existing production website must remain untouched during development.
- No course fees, schedules, or instructor details may be published without written CONSOL approval.
- Client logos require explicit permission before use.
- Amharic translations of official company statements require CONSOL review.
- PHP version and hosting configuration must be verified before backend deployment.
