# 07 — API Documentation

## Base URL
```
Development:  http://localhost:8000/api
Production:   https://<domain>/api
```

## Authentication
Cookie-based SPA authentication via **Laravel Sanctum**.
- The client sends `X-Requested-With: XMLHttpRequest` and `withCredentials: true`.
- The `XSRF-TOKEN` cookie is echoed as the `X-XSRF-TOKEN` header.
- Sanctum stateful domains must include the frontend origin.

---

## Public Endpoints

### Health Check
```http
GET /api/health
```
Returns `200 OK` with `{ "status": "ok" }`.

---

### Services
```http
GET /api/services
```
**Response:** `200 OK`
```json
[
  {
    "slug": "construction-management-consultancy",
    "title": "Construction Management Consultancy",
    "summary": "...",
    "category": "construction-management",
    "image": "/media/site-inspection.jpg",
    "scope": ["PMO set-up and consultancy", "..."]
  }
]
```

---

### Projects
```http
GET /api/projects?category={category}&year={year}&q={search}&page={page}
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category slug |
| `year` | integer | Filter by project year |
| `q` | string | Full-text search |
| `page` | integer | Pagination page number |

**Response:** `200 OK` — paginated project list.

```http
GET /api/projects/{slug}
```
**Response:** `200 OK`
```json
{
  "slug": "opm-maturity-improvement",
  "title": "OPM Maturity Improvement",
  "client": "Client Name",
  "location": "Addis Ababa",
  "year": 2023,
  "summary": "...",
  "scope": [],
  "services": [],
  "image": "/media/project.jpg",
  "source": "https://..."
}
```

---

### Courses
```http
GET /api/courses?category={category}
```

```http
GET /api/courses/{slug}
```
**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Project Management Professional",
  "category": "construction-management",
  "duration": 5,
  "durationUnit": "days",
  "certificationBody": "PMI",
  "summary": "...",
  "objectives": [],
  "audience": [],
  "curriculum": []
}
```

---

### News
```http
GET /api/news?category={category}&page={page}
```

```http
GET /api/news/{slug}
```
**Response:** `200 OK`
```json
{
  "slug": "article-title",
  "title": "Article Title",
  "excerpt": "...",
  "date": "2026-01-15",
  "category": "company",
  "body": ["Paragraph 1", "Paragraph 2"]
}
```

---

### Events
```http
GET /api/events
GET /api/events/{slug}
```

---

## Form Submission Endpoints

### Inquiries (Contact Form)
```http
POST /api/inquiries
Content-Type: application/json
```
**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, email)",
  "phone": "string (optional)",
  "subject": "string (required)",
  "message": "string (required)",
  "consent": "boolean (required, true)",
  "source": "string (optional)"
}
```
**Response:** `201 Created`

---

### Consultations
```http
POST /api/consultations
Content-Type: application/json
```
**Body:**
```json
{
  "name": "string (required)",
  "organisation": "string (optional)",
  "email": "string (required, email)",
  "phone": "string (optional)",
  "service": "string (required)",
  "subject": "string (required)",
  "message": "string (required)",
  "preferredContact": "string (optional, enum: email|phone)",
  "source": "string (optional)"
}
```
**Response:** `201 Created`

---

### Registrations (Training)
```http
POST /api/registrations
Content-Type: application/json
```
**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, email)",
  "phone": "string (optional)",
  "organisation": "string (optional)",
  "role": "string (optional)",
  "city": "string (optional)",
  "notes": "string (optional)",
  "consent": "boolean (required, true)",
  "course_id": "integer (required)",
  "course_title": "string (required)"
}
```
**Response:** `201 Created`

---

## Authentication Endpoints

```http
POST /api/auth/login
```
**Body:** `{ "email": "string", "password": "string", "remember": "boolean (optional)" }`
**Response:** `200 OK` — sets session cookie.

```http
POST /api/auth/logout
```
**Response:** `204 No Content`

```http
GET /api/auth/me
```
**Response:** `200 OK`
```json
{ "id": 1, "name": "Admin", "email": "admin@consol.com", "roles": ["admin"] }
```

---

## Error Responses
| Status | Meaning |
|--------|---------|
| `401` | Unauthenticated |
| `403` | Forbidden |
| `404` | Resource not found |
| `422` | Validation error (returns `{ "errors": { "field": ["message"] } }`) |
| `429` | Rate limit exceeded |
| `500` | Server error |
