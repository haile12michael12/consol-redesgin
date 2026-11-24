# 08 — Frontend Documentation

## 1. Overview
The frontend is a **React 19 Single Page Application** built with Vite, Tailwind CSS v4, and React Router. It is located in the `frontend/` directory.

## 2. Tech Stack
| Dependency | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | Latest | Build tool and dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | Latest | Client-side routing |
| TanStack React Query | v5 | Server state management and caching |
| Axios | Latest | HTTP client |
| Radix UI | Latest | Accessible headless primitives |
| Framer Motion | Latest | Animations and transitions |
| class-variance-authority | Latest | Variant-based component styling |
| Vitest | Latest | Unit and integration testing |

## 3. Project Structure
```
src/
├── components/
│   ├── about/          # About section (AboutSubNav)
│   ├── admin/          # Admin UI shell (AdminUI)
│   ├── common/         # Reusable components
│   ├── forms/          # Contact, Consultation, Registration forms
│   ├── home/           # Homepage sections
│   ├── layout/         # Header, Footer, LanguageSwitcher
│   ├── news/           # News components (ShareRow)
│   ├── services/       # ServiceCard
│   ├── training/       # CourseCard
│   └── ui/             # Design system primitives
├── data/               # Static/demo data
├── hooks/              # Custom hooks (useApiQuery)
├── i18n/               # Translations (en.js, am.js, LanguageProvider)
├── layouts/            # Layout wrappers (PublicLayout, AdminLayout)
├── lib/                # Utilities, site config
├── pages/              # Route page components
│   ├── admin/          # Admin pages
│   └── public/         # Public pages
├── routes/             # Route definitions
├── services/           # API service layer
├── test/               # Test files
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── styles.css          # Design system tokens
```

## 4. Data Flow Pattern
```
User Action → React Component → API Service (Axios) → Laravel API
                                      ↓
                              TanStack Query Cache
                                      ↓
                              Component Re-render
```

**Fallback pattern:** When the API is unavailable, `resolveWithFallback` returns static demo data from `src/data/` so the UI always renders.

## 5. Internationalisation (i18n)
- Two language files: `en.js` (English) and `am.js` (Amharic)
- `LanguageProvider` wraps the app and exposes a `useT()` hook for translations
- Language can be switched at any time via the `LanguageSwitcher` component
- Translation keys follow a dot notation: `service.cm.title`, `nav.about`, etc.

## 6. API Service Layer (`src/services/`)
| Service File | Endpoints Covered |
|-------------|-------------------|
| `api.js` | Axios instance configuration |
| `servicesApi.js` | `GET /api/services` |
| `projectsApi.js` | `GET /api/projects`, `GET /api/projects/{slug}` |
| `coursesApi.js` | `GET /api/courses`, `GET /api/courses/{slug}` |
| `newsApi.js` | `GET /api/news`, `GET /api/news/{slug}` |
| `inquiriesApi.js` | `POST /api/inquiries` |
| `authApi.js` | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| `assistantApi.js` | AI assistant queries |

## 7. Key Pages
| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, services, projects, training, news, CTA |
| About | `/about` | Company overview with sub-navigation |
| History | `/about/history` | Company timeline |
| Services | `/services` | Services catalogue |
| Training | `/training` | Course listings |
| Course Detail | `/training/:slug` | Individual course |
| Projects | `/projects` | Project portfolio |
| News | `/news` | News listing |
| News Article | `/news/:slug` | Individual article |
| Events | `/events` | Event listings |
| Event Detail | `/events/:slug` | Individual event |
| Contact | `/contact` | Contact form |
| Consultation | `/consultation` | Consultation request form |
| Certifications | `/certifications` | Autodesk ATC, PMI ATP |
| Clients & Partners | `/clients-partners` | Client logos and partners |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin/dashboard` | Admin metrics |
| Admin Modules | `/admin/:module` | Admin CRUD modules |

## 8. Build & Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint
npm run lint
```
