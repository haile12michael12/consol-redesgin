# CONSOL — Construction Solutions PLC

Corporate website redesign for [Construction Solutions PLC](https://www.constructionsolutionsplc.com/). The repository contains the React frontend and Laravel REST API; the frontend communicates with the API over HTTP and never connects directly to the database.

## Project structure

| Directory | Purpose |
| --- | --- |
| [`frontend/`](frontend/) | React 19 + Vite website, admin interface, tests, and static assets |
| [`backend/`](backend/) | Laravel API, MySQL/SQLite configuration, migrations, seeders, and feature tests |

The frontend is JavaScript (not TypeScript) and uses Tailwind CSS v4, React Router, shadcn-style UI primitives, Lucide, Framer Motion, Axios, TanStack Query, React Hook Form, and Zod. The backend uses Laravel, Sanctum authentication, Eloquent, and database migrations.

## Local development

### Frontend

In PowerShell:

```powershell
cd frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run dev
```

Vite runs at `http://localhost:5173`. Configure `VITE_API_BASE_URL` in `frontend/.env` to point to the Laravel API; the example value is `http://localhost:8000/api`.

Useful frontend commands:

```powershell
npm run build
npm run preview
npm run lint
npm test
```

### Laravel API

In a second terminal:

```powershell
cd backend
composer install
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  php artisan key:generate
}
```

Configure the database in `backend/.env`, then run:

```powershell
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
```

The backend example environment is configured for SQLite; set the `DB_*` values for MySQL when using MySQL locally or in deployment. Configure the API's CORS and Sanctum stateful domains for the frontend origin. Run backend tests with:

```powershell
php artisan test
```

Never commit `.env` files, API keys, database credentials, or other secrets. Provider credentials belong on the backend and must not use a `VITE_` variable.

## Website features

- Public company pages for the company profile, services, projects, training, news, events, resources, contact, and consultation requests.
- Admin routes under `/admin` for authorized content and operational management.
- English and Amharic interfaces. English keeps the existing routes; Amharic uses the `/am` prefix (for example, `/am/projects`). The selected language is remembered, and requests send the corresponding `Accept-Language` header.
- Approved content translations are managed separately from English source content. Editors can save drafts and submit them for review; only authorized approvers can publish Amharic translations. Untranslated fields fall back to English. Official company statements are not automatically translated.
- SEO metadata includes localized canonical URLs and language alternatives.

## CONSOL Project Intelligence

The project portfolio uses the existing project API and admin module to present published records as case studies, not generic demo projects.

- The listing combines an editorial introduction, featured engagement, search, category and project-type filters, and responsive project cards.
- Case study pages can show the project overview, context and objectives, client challenge, CONSOL role and services, methodology, milestones, gallery, documented outcomes, related work, and consultation action.
- Case-study details are optional and appear only when supplied. Client and location details are public only when approved for publication.
- Demonstration records are not presented as actual engagements. Illustrative fallback photography is clearly labelled; no client names, project outcomes, values, or statistics are invented.
- Authorized administrators manage project content, publication status, client/location approvals, SEO fields, and gallery images at `/admin/projects`.

The backend supports:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | Published projects, pagination and filters: `q`, `category`, `year`, `featured`, and `project_type` |
| `GET` | `/api/projects/categories` | Categories used by published projects |
| `GET` | `/api/projects/types` | Available project types with locale-specific labels |
| `GET` | `/api/projects/{slug}` | Published case study and related projects |

The project schema includes fields for project type/date, context, objectives, challenge, approach, milestones, scope, services, outcomes, and images. New fields are nullable; existing records remain valid. Apply the latest schema changes with `php artisan migrate`.

## Content and publishing principles

- Public endpoints return published content; drafts remain behind authorized admin routes.
- Publish only verified company information. Keep optional facts empty until CONSOL supplies and approves them.
- Obtain approval before publishing client details, project imagery, outcomes, or other potentially sensitive engagement information.
- Keep translated content reviewable and editable by authorized administrators; do not silently replace published translations with drafts.
- The frontend uses the Laravel API configured through `VITE_API_BASE_URL`; it does not use Supabase, Firebase, or a second backend.

## Build and deployment

`npm run build` in `frontend/` produces the static site in `frontend/dist/`. Configure the web host to serve the frontend over HTTPS and rewrite client-side routes to `index.html`. Set `VITE_API_BASE_URL` to the deployed Laravel API URL at build time, then configure the API's CORS and Sanctum settings to allow the production frontend origin.

The Laravel application and its database are deployed and operated separately from the static frontend. Run database migrations as part of the backend deployment process.
