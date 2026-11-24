# 03 — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Browser                │
│  React 19 + Vite + Tailwind CSS v4              │
│  SPA served from static hosting / CDN           │
└───────────────────┬─────────────────────────────┘
                    │  HTTPS / JSON
                    │  withCredentials (cookies)
                    ▼
┌─────────────────────────────────────────────────┐
│              Laravel 11 Backend                 │
│  ┌────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │  Routes /  │  │  Controllers │  │  Models  │ │
│  │  Middleware │→ │  + Services  │→ │  + DB   │ │
│  └────────────┘  └──────────────┘  └─────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │  Sanctum (SPA cookie auth)                 │ │
│  │  CORS · Rate Limiting · Validation         │ │
│  └────────────────────────────────────────────┘ │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
           ┌───────────────┐
           │   Database    │
           │  SQLite (dev) │
           │  MySQL (prod) │
           └───────────────┘
```

## Architecture Principles
1. **API-first** — The frontend communicates exclusively via REST; no server-side rendering, no Blade views for public pages.
2. **Separation of concerns** — Frontend and backend are independent projects in the same repository. The frontend knows nothing about PHP; the backend knows nothing about React.
3. **Graceful degradation** — The frontend ships with static demo data and falls back to it when the API is unavailable, using the `resolveWithFallback` pattern.
4. **Progressive enhancement** — Reduced-motion guards, skip-to-content links, semantic HTML, ARIA attributes.

## Communication Flow
1. Browser loads the SPA (static HTML + JS bundles from Vite build).
2. React Router handles client-side navigation.
3. TanStack React Query calls Axios service functions → `GET /api/*` endpoints.
4. Axios is configured with `withCredentials: true`, sends `X-Requested-With: XMLHttpRequest`, and echoes the `XSRF-TOKEN` cookie as `X-XSRF-TOKEN`.
5. Laravel validates, queries, and returns JSON.
6. For mutations (forms, auth), `POST` requests follow the same cookie-based CSRF flow.

## Deployment Topology (Target)
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  CDN / Static│     │  Web Server  │     │   Database   │
│  (frontend)  │     │  (Laravel)   │     │   (MySQL)    │
│  Vite build  │────▶│  Apache/Nginx│────▶│  Production  │
│  dist/       │     │  PHP 8.2+    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```
