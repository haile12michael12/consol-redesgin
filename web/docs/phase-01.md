# Phase 1 — Foundation, design system and homepage

**Status:** complete and verified (build, lint, 25 automated tests, live preview).
**Scope note:** this phase deliberately went beyond a bare foundation. The brief
asks for a polished foundation *and* an initial homepage preview, so the public
information architecture, the forms and an admin UI shell were built on top of
the design system rather than leaving dead navigation links.

---

## 1. What was built

**Design system (`src/styles.css`)**
Navy/gold token set, fluid type scale, `.shell` container, `.section` rhythm,
`.eyebrow`, `.link-arrow`, `.prose-consol`, form field styles, reduced-motion
guards. Geometry is square (3–6px) by design — no pill cards, no gradients as
decoration.

**Primitives (`src/components/ui/`)**
Button (7 variants, `asChild`), Card, Badge, Input/Textarea, Select (Radix),
Field/Label, Dialog, Accordion, Tabs, FilterPill, Skeleton, Toaster (sonner).

**Shared components (`src/components/common/`, `layout/`)**
Logo, SectionHeading, PageHero, Breadcrumbs, Pagination, Lightbox, Reveal,
LoadingState/CardGridSkeleton/ErrorState/EmptyState/Notice, AssistantWidget,
SiteHeader (sticky, utility bar, accessible dropdowns, mobile drawer),
SiteFooter, LanguageSwitcher.

**Routes** — all public pages and admin routes listed in `README.md`, wrapped in
`PublicLayout` / `AdminLayout`, code-split.

**Homepage** — hero, company introduction, credibility (published figures only),
four core services, featured engagements, training, why CONSOL, clients and
credential partners, news, consultation CTA, footer.

**Data layer** — `src/lib/site.js` (verified facts), `src/data/*` (published
records + separately marked demo records).

**API layer** — Axios instance, error normalisation, `resolveWithFallback`,
domain services, TanStack Query hook.

---

## 2. Verification performed

| Check | Command | Result |
| --- | --- | --- |
| Production build | `npm run build` | Passes; route-level chunks, vendor split |
| Lint | `npm run lint` | No errors |
| Tests | `npm test` | 25 passed / 3 files |
| Contrast | included above | WCAG AA for body, label and on-navy text |
| Route smoke test | dev + preview servers | 200 on every route, including a deep admin route |
| Preview host headers | preview server | Serves for proxied hosts |

Test coverage includes: homepage render, services catalogue, verified project
record, course page asserting *no* invented fee or date, 404, admin demo
dashboard, navigation CTA, live language switch to Amharic, contact-form
validation, consultation validation, assistant answer, error boundary, data
integrity rules, palette contrast.

**Not verified:** pixel rendering in a real browser. Chromium could not be
downloaded in this environment (network allowlist), so layout was verified
through compiled-CSS inspection, breakpoint review and the automated DOM tests
instead. A visual pass on desktop/tablet/mobile is the first item of Phase 2 QA.

---

## 3. Laravel contract prepared for this UI

The client already calls these paths and will switch from demo data to live data
as soon as they exist. Nothing here has been implemented or tested server-side.

```http
GET  /api/health
GET  /api/services            → [{ slug, title, summary, category, image, scope[] }]
GET  /api/projects?category=&year=&q=&page=
GET  /api/projects/{slug}     → { slug, title, client, location, year, summary,
                                  scope[], services[], image, source }
GET  /api/courses?category=
GET  /api/courses/{slug}      → { id, title, category, duration, durationUnit,
                                  certificationBody, summary, objectives[],
                                  audience[], curriculum[] }
GET  /api/news?category=&page=
GET  /api/news/{slug}         → { slug, title, excerpt, date, category, body[] }
GET  /api/events, GET /api/events/{slug}
POST /api/inquiries       { name, email, phone, subject, message, consent, source }
POST /api/consultations   { name, organisation, email, phone, service, subject,
                            message, preferredContact, source }
POST /api/registrations   { name, email, phone, organisation, role, city, notes,
                            consent, course_id, course_title }
POST /api/auth/login      { email, password, remember? }
POST /api/auth/logout
GET  /api/auth/me         → { id, name, email, roles[] }
```

Server responsibilities: validation, rate limiting, spam protection, email
notification, authorisation (Sanctum), audit logging. The client sends
`X-Requested-With: XMLHttpRequest`, `withCredentials: true`, and echoes the
`XSRF-TOKEN` cookie as `X-XSRF-TOKEN`.

CORS must allow the site origin; Sanctum stateful domains must include it.

---

## 4. Content requiring CONSOL approval before launch

1. Reviewed Amharic translations for company statements (vision, mission,
   overview paragraphs).
2. Company profile PDF (button is present and disabled).
3. Business hours and exact office coordinates for the map.
4. Written permission for client logos or continued use of text marks.
5. Approved client testimonials (published testimonial text exists on the
   current site and can be added on approval).
6. Portraits and biographies for the leadership page.
7. Course syllabus, fees, schedules and instructors — intentionally absent.
8. Privacy notice and terms.

---

## 5. Phase 2 proposal

1. Browser QA at 390 / 768 / 1024 / 1440 px; fix visual detail.
2. Replace the illustrative photography with approved CONSOL project imagery as
   it becomes available.
3. Wire the Laravel endpoints that exist, starting with inquiries and
   consultations (highest business value).
4. Add Sanctum-based admin authentication and route guards.
5. Content entry for real project/news records, then disable demo mode.
