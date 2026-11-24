# 11 — Security Guidelines

## 1. Authentication & Authorization
| Control | Implementation |
|---------|---------------|
| Authentication | Laravel Sanctum cookie-based SPA auth |
| Password hashing | Bcrypt with 12 rounds |
| Session management | Database-backed sessions, 120-minute lifetime |
| CSRF protection | `XSRF-TOKEN` cookie echoed as `X-XSRF-TOKEN` header |
| Route protection | Sanctum middleware on all admin API routes |
| Role-based access | User `roles[]` field checked in middleware/policies |

## 2. Input Validation & Sanitisation
- **All form inputs** are validated server-side using Laravel Form Requests.
- **Client-side validation** provides UX feedback but is never trusted.
- **SQL injection** is prevented by Eloquent ORM (parameterised queries).
- **XSS** is mitigated by React's default output escaping and server-side sanitisation.
- **Mass assignment** is prevented by Eloquent's `$fillable` / `$guarded` properties.

## 3. CORS Configuration
```php
// Sanctum stateful domains must include the frontend origin
'stateful' => ['localhost:5173', 'localhost:3000', 'your-domain.com'],

// CORS allowed origins
'allowed_origins' => ['http://localhost:5173', 'https://your-domain.com'],
'supports_credentials' => true,
```

## 4. Rate Limiting
| Endpoint | Limit |
|----------|-------|
| `POST /api/inquiries` | 5 per minute per IP |
| `POST /api/consultations` | 5 per minute per IP |
| `POST /api/registrations` | 5 per minute per IP |
| `POST /api/auth/login` | 5 per minute per IP |
| General API | 60 per minute per IP |

## 5. Environment Security
- **`.env` file** must never be committed to version control.
- **`APP_DEBUG`** must be `false` in production.
- **`APP_KEY`** must be unique per environment and kept secret.
- **Database credentials** must use strong, unique passwords in production.
- **Storage and cache directories** must not be publicly accessible.

## 6. HTTPS
- All production traffic must be served over HTTPS.
- HTTP requests should redirect to HTTPS.
- HSTS headers should be enabled.
- Cookies must have `Secure` and `SameSite` attributes.

## 7. File Upload Security (if applicable)
- Validate file type (MIME and extension).
- Limit file size.
- Store uploads outside the web root or in private storage.
- Generate unique filenames; never trust user-provided names.

## 8. Logging & Monitoring
- Log all authentication events (login, logout, failed attempts).
- Log admin CRUD operations (audit trail).
- Never log passwords, tokens, or sensitive personal data.
- Monitor for unusual patterns (multiple failed logins, high submission rates).

## 9. Dependency Security
- Run `composer audit` regularly for PHP vulnerabilities.
- Run `npm audit` regularly for JavaScript vulnerabilities.
- Keep Laravel, PHP, and all dependencies updated.

## 10. Security Checklist Before Deployment
- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] Unique `APP_KEY` generated
- [ ] HTTPS enforced
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] `.env` excluded from version control
- [ ] Database credentials are strong and unique
- [ ] `storage/` and `bootstrap/cache/` permissions restricted
- [ ] Error pages do not reveal stack traces
- [ ] Admin accounts use strong passwords
- [ ] Logging configured (no sensitive data logged)
