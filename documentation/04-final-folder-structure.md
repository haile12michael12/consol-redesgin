# 04 — Final Folder Structure

```
consol-redesgin/
│
├── backend/                        # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/        # API controllers
│   │   ├── Models/                 # Eloquent models
│   │   └── Providers/              # Service providers
│   ├── bootstrap/
│   │   ├── app.php
│   │   └── providers.php
│   ├── config/                     # Laravel configuration files
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cache.php
│   │   ├── database.php
│   │   ├── filesystems.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── services.php
│   │   └── session.php
│   ├── database/
│   │   ├── factories/              # Model factories (testing)
│   │   ├── migrations/             # Database migrations
│   │   ├── seeders/                # Data seeders
│   │   └── database.sqlite         # Dev SQLite database
│   ├── public/                     # Web root
│   │   └── index.php
│   ├── resources/
│   │   ├── css/
│   │   ├── js/
│   │   └── views/
│   ├── routes/
│   │   ├── console.php
│   │   └── web.php                 # Will include api.php routes
│   ├── storage/
│   │   ├── app/
│   │   ├── framework/
│   │   └── logs/
│   ├── tests/
│   │   ├── Feature/
│   │   ├── Unit/
│   │   └── TestCase.php
│   ├── .env
│   ├── artisan
│   ├── composer.json
│   └── phpunit.xml
│
├── frontend/                       # React 19 SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── about/              # About section components
│   │   │   ├── admin/              # Admin UI shell
│   │   │   ├── common/             # Shared components (Breadcrumbs, PageHero, etc.)
│   │   │   ├── forms/              # Form components (Contact, Consultation, Registration)
│   │   │   ├── home/               # Homepage sections (Hero, Services, Projects, etc.)
│   │   │   ├── layout/             # SiteHeader, SiteFooter, LanguageSwitcher
│   │   │   ├── news/               # News components
│   │   │   ├── services/           # Service card components
│   │   │   ├── training/           # Course card components
│   │   │   └── ui/                 # Design system primitives (Button, Card, Input, etc.)
│   │   ├── data/                   # Static/demo data files
│   │   ├── hooks/                  # Custom React hooks (useApiQuery)
│   │   ├── i18n/                   # Internationalisation (en.js, am.js, LanguageProvider)
│   │   ├── layouts/                # Layout wrappers
│   │   ├── lib/                    # Utilities and site config
│   │   ├── pages/                  # Route page components (admin/, public/)
│   │   ├── routes/                 # Route definitions
│   │   ├── services/               # API service layer (Axios-based)
│   │   ├── test/                   # Vitest test files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css              # Design system tokens
│   ├── docs/                       # Phase/module documentation
│   ├── dist/                       # Production build output
│   ├── package.json
│   ├── vite.config.js
│   └── vitest.config.ts
│
├── documentation/                  # Project documentation (this folder)
│   ├── 01-project-overview.md
│   ├── 02-requirements-specification.md
│   ├── 03-system-architecture.md
│   ├── 04-final-folder-structure.md
│   ├── 05-design-system.md
│   ├── 06-database-design.md
│   ├── 07-api-documentation.md
│   ├── 08-frontend-documentation.md
│   ├── 09-backend-documentation.md
│   ├── 10-admin-user-guide.md
│   ├── 11-security-guidelines.md
│   ├── 12-testing-plan.md
│   ├── 13-deployment-guide.md
│   ├── 14-maintenance-guide.md
│   └── 15-project-handover.md
│
└── README.md                       # Project root readme
```
