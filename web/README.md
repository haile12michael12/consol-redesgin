# CONSOL — Corporate website frontend

Frontend for **Construction Solutions PLC (CONSOL)**, an Ethiopian construction
management consultancy, training and research institute.

- **Stack:** React 19 + Vite, JavaScript (no TypeScript), Tailwind CSS v4,
  shadcn/ui primitives, React Router, Lucide, Framer Motion, Axios,
  TanStack Query, React Hook Form, Zod.
- **Backend:** an existing, separate Laravel REST API (not in this repository).
  This app never touches MySQL directly and holds no database credentials.

> This is a redesign of the real company site
> <https://www.constructionsolutionsplc.com/>. Only published company
> information is reproduced. Anything illustrative is labelled as such.

---

## Run it

```bash
cd web
cp .env.example .env      # then adjust if needed
npm install
npm run dev               # http://localhost:5173
npm run build             # production bundle in dist/
npm run preview           # serve the production build
npm run lint
npm test                  # Vitest + Testing Library
```

Environment variables (`.env`, never committed):

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Laravel API root. Local: `http://127.0.0.1:8000/api`. Production: the deployed API URL. |
| `VITE_ENABLE_DEMO_DATA` | `true` while endpoints are not implemented. When `true`, unavailable endpoints fall back to labelled demo content. Must be `false` for go-live. |
| `VITE_ASSISTANT_ENDPOINT` | Optional public Laravel assistant route. **Never** an AI provider key. |

---

## Content policy (important)

Two kinds of content are kept strictly apart:

| | Where | Marker in the UI |
| --- | --- | --- |
| Verified company content | `src/lib/site.js`, `src/data/*` with `source: 'published'` | None — shown normally, with "Source: CONSOL company overview" notes where numbers appear |
| Demonstration / illustrative content | `src/data/adminDemo.js`, project records with `source: 'demo'` (slug prefixed `demo-`), course `outline: 'demo'` | Gold **Demo** badge, explicit disclaimer text |

Rules enforced by `src/test/data-integrity.test.js`:

- demonstration projects must be prefixed `demo-` and can never be `featured`;
- no course date, fee, instructor or availability field may exist in the data;
- every published project keeps a client and a year.

Photography in `public/media/` is licensed illustrative imagery. It is **not**
presented as a photograph of any specific CONSOL project; each gallery says so.

Not invented, and deliberately absent until supplied by CONSOL: company profile
PDF, business hours, office map coordinates, client logos, testimonials,
individual team biographies, awards, and any statistic beyond what the company
publishes.

---

## Structure

```text
web/
  public/media/            illustrative photography
  src/
    assets/
    components/
      ui/                  shadcn-style primitives (button, card, input, select,
                           dialog, accordion, tabs, badge, skeleton, toaster…)
      common/              SectionHeading, PageHero, Breadcrumbs, Pagination,
                           Lightbox, Reveal, StateBlocks, AssistantWidget, Logo
      layout/              SiteHeader, SiteFooter, LanguageSwitcher
      home/                one component per homepage section
      services/ projects/ training/ news/ forms/ about/ admin/
    data/                  published + demo content, clearly separated
    hooks/
    i18n/                  LanguageProvider, en.js, am.js
    layouts/               PublicLayout, AdminLayout
    lib/                   site.js (verified facts), navigation, schemas, seo, utils
    pages/public/          one file per route (+ about/ sub-pages)
    pages/admin/           dashboard, pages, module tables, settings, login
    routes/AppRoutes.jsx    full route tree, code-split
    services/              api.js + domain services (Axios + demo fallback)
    test/
    App.jsx  main.jsx  styles.css
```

### Routes

Public: `/`, `/about`, `/about/vision-mission`, `/about/leadership`,
`/about/history`, `/about/structure`, `/about/certifications`,
`/about/clients-partners`, `/services`, `/services/:slug`, `/projects`,
`/projects/:slug`, `/training`, `/training/:slug`,
`/training/:slug/register`, `/news`, `/news/:slug`, `/events`,
`/events/:slug`, `/contact`, `/request-consultation`.

Admin (UI preview): `/admin/login`, `/admin/dashboard`, `/admin/pages`,
`/admin/company-profile`, `/admin/services`, `/admin/projects`,
`/admin/training`, `/admin/registrations`, `/admin/certificates`,
`/admin/news`, `/admin/media`, `/admin/inquiries`, `/admin/analytics`,
`/admin/users`, `/admin/settings`.

---

## API integration

`src/services/api.js` creates one Axios instance from `VITE_API_BASE_URL` with
`withCredentials` (Sanctum cookie flow) and normalises every error into
`{ status, message, errors }`. Domain services return
`{ data, source: 'api' | 'demo' | 'error', error }`, so a screen always knows
whether it is showing live data.

Implemented service modules: `servicesApi`, `projectsApi`, `coursesApi`,
`newsApi`, `inquiriesApi`, `authApi`, `assistantApi`.

### Laravel endpoints this frontend expects

| Method | Path | Used by |
| --- | --- | --- |
| GET | `/api/health` | connectivity check |
| GET | `/api/services`, `/api/services/{slug}` | services |
| GET | `/api/projects`, `/api/projects/{slug}` | portfolio |
| GET | `/api/courses`, `/api/courses/{slug}` | training catalogue |
| GET | `/api/news`, `/api/news/{slug}` | news |
| GET | `/api/events`, `/api/events/{slug}` | events |
| POST | `/api/inquiries` | contact form |
| POST | `/api/consultations` | consultation form |
| POST | `/api/registrations` | course registration interest |
| POST | `/api/auth/login`, `/api/auth/logout`, GET `/api/auth/me` | admin (Sanctum) |
| POST | assistant route (configurable) | AI assistant UI |

Laravel remains responsible for validation, authorisation, spam protection,
rate limiting, notifications and persistence. Suggested JSON shapes are in
`docs/phase-01.md`. **No endpoint above should be assumed to exist until it is
implemented and tested against this client.**

---

## Internationalisation

English and Amharic ship in `src/i18n`. The switcher persists the choice in
localStorage, sets `<html lang>` and swaps to the Ethiopic typeface.
Company statements (vision, mission, overview) stay in their **published
English wording** until CONSOL supplies a reviewed Amharic version — the
dictionary falls back to English for any missing key, which is intentional.

## AI assistant

`AssistantWidget` is a complete interface (floating button, window, history,
loading, error, mobile layout). Answers today come from a knowledge base built
strictly from published CONSOL content in `src/services/assistantApi.js`.
When the Laravel assistant endpoint is ready, set `VITE_ASSISTANT_ENDPOINT`;
provider API keys stay server-side and must never appear in frontend code.

## Accessibility & quality

- Skip link, landmark regions, labelled controls, visible focus rings.
- Keyboard-operable dropdowns, mobile drawer with focus trap, Escape handling.
- Dialog (Radix) semantics for lightbox, confirmation and admin edit.
- Palette contrast is tested automatically (`src/test/contrast.test.js`) —
  WCAG AA for body/label text, including text on navy.
- Reduced-motion support; images lazy-loaded except the hero.
- Route-level code splitting and vendor chunking; per-page titles, meta
  descriptions, canonical URLs and JSON-LD.

## Deployment

`npm run build` outputs a static `dist/`. Configure the host to rewrite unknown
paths to `index.html` (SPA routing), serve over HTTPS, and set
`VITE_API_BASE_URL` plus `VITE_ENABLE_DEMO_DATA=false` in the hosting
environment. The Laravel API must allow the site origin for CORS and Sanctum
stateful domains.
