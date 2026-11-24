# 09 — Backend Documentation

## 1. Overview
The backend is a **Laravel 11** application providing a RESTful JSON API for the CONSOL website. It is located in the `backend/` directory.

## 2. Tech Stack
| Component | Technology |
|-----------|-----------|
| Framework | Laravel 11 |
| Language | PHP 8.2+ |
| Database (dev) | SQLite |
| Database (prod) | MySQL (version TBD) |
| Authentication | Laravel Sanctum (cookie-based SPA auth) |
| Session Driver | Database |
| Cache Driver | Database |
| Queue Driver | Database |
| Mail | Log (dev) / SMTP (prod) |
| Testing | PHPUnit |

## 3. Project Structure
```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/        # API controllers
│   ├── Models/                 # Eloquent models
│   │   └── User.php
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
├── config/                     # Framework configuration
├── database/
│   ├── factories/              # Model factories for testing
│   ├── migrations/             # Schema migrations
│   ├── seeders/                # Database seeders
│   └── database.sqlite         # Development database
├── routes/
│   ├── web.php                 # Web routes
│   └── console.php             # CLI commands
├── storage/
├── tests/
│   ├── Feature/                # Feature tests
│   ├── Unit/                   # Unit tests
│   └── TestCase.php
├── .env                        # Environment config
├── artisan                     # CLI entry point
├── composer.json               # PHP dependencies
└── phpunit.xml                 # Test configuration
```

## 4. Configuration
Key `.env` settings:
```env
APP_NAME=Laravel
APP_ENV=local
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
BCRYPT_ROUNDS=12
```

## 5. Models to Implement
| Model | Table | Key Relationships |
|-------|-------|------------------|
| User | `users` | — |
| Service | `services` | hasMany Projects (via pivot) |
| Project | `projects` | belongsToMany Services |
| Course | `courses` | hasMany Registrations |
| News | `news` | — |
| Event | `events` | — |
| Inquiry | `inquiries` | — |
| Consultation | `consultations` | — |
| Registration | `registrations` | belongsTo Course |

## 6. Controllers to Implement
| Controller | Endpoints | Auth Required |
|-----------|-----------|---------------|
| `HealthController` | `GET /api/health` | No |
| `ServiceController` | `GET /api/services` | No |
| `ProjectController` | `GET /api/projects`, `GET /api/projects/{slug}` | No |
| `CourseController` | `GET /api/courses`, `GET /api/courses/{slug}` | No |
| `NewsController` | `GET /api/news`, `GET /api/news/{slug}` | No |
| `EventController` | `GET /api/events`, `GET /api/events/{slug}` | No |
| `InquiryController` | `POST /api/inquiries` | No |
| `ConsultationController` | `POST /api/consultations` | No |
| `RegistrationController` | `POST /api/registrations` | No |
| `AuthController` | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Partial |
| `AdminController` | Admin CRUD endpoints | Yes |

## 7. Middleware Stack
| Middleware | Purpose |
|-----------|---------|
| `EnsureFrontendRequestsAreStateful` | Sanctum SPA cookie auth |
| `ThrottleRequests` | Rate limiting |
| `VerifyCsrfToken` | CSRF protection |
| CORS | Allow frontend origin |

## 8. Commands
```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start dev server
php artisan serve

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 9. Current Status
The backend is in its **initial scaffolding** state. The User model, session/cache/jobs migrations exist. All API controllers, additional models, and routes are yet to be implemented. The backend currently serves only the default Laravel welcome view.
