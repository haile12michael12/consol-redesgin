# 06 — Database Design

## 1. Overview
- **Development:** SQLite (`database/database.sqlite`)
- **Production:** MySQL (version TBD — pending hosting configuration review)
- **ORM:** Eloquent (Laravel)
- **Migrations:** Laravel migration files in `database/migrations/`

## 2. Existing Migrations
| Migration | Table | Purpose |
|-----------|-------|---------|
| `0001_01_01_000000` | `users` | Admin user accounts |
| `0001_01_01_000001` | `cache` | Application cache store |
| `0001_01_01_000002` | `jobs` | Queue job storage |

## 3. Planned Entity-Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    users     │     │   services   │     │     projects     │
├──────────────┤     ├──────────────┤     ├──────────────────┤
│ id           │     │ id           │     │ id               │
│ name         │     │ slug         │     │ slug             │
│ email        │     │ title        │     │ title            │
│ password     │     │ summary      │     │ client           │
│ roles[]      │     │ category     │     │ location         │
│ created_at   │     │ image        │     │ year             │
│ updated_at   │     │ scope[]      │     │ summary          │
└──────────────┘     │ order        │     │ scope[]          │
                     │ created_at   │     │ image            │
                     └──────────────┘     │ source           │
                                          │ created_at       │
┌──────────────┐     ┌──────────────┐     └──────────────────┘
│   courses    │     │     news     │
├──────────────┤     ├──────────────┤     ┌──────────────────┐
│ id           │     │ id           │     │     events       │
│ slug         │     │ slug         │     ├──────────────────┤
│ title        │     │ title        │     │ id               │
│ category     │     │ excerpt      │     │ slug             │
│ duration     │     │ date         │     │ title            │
│ duration_unit│     │ category     │     │ date             │
│ cert_body    │     │ body[]       │     │ location         │
│ summary      │     │ image        │     │ description      │
│ objectives[] │     │ created_at   │     │ image            │
│ audience[]   │     └──────────────┘     │ created_at       │
│ curriculum[] │                          └──────────────────┘
│ created_at   │
└──────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   inquiries      │  │  consultations   │  │  registrations   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id               │  │ id               │  │ id               │
│ name             │  │ name             │  │ name             │
│ email            │  │ organisation     │  │ email            │
│ phone            │  │ email            │  │ phone            │
│ subject          │  │ phone            │  │ organisation     │
│ message          │  │ service          │  │ role             │
│ consent          │  │ subject          │  │ city             │
│ source           │  │ message          │  │ notes            │
│ read_at          │  │ preferred_contact│  │ consent          │
│ created_at       │  │ source           │  │ course_id        │
└──────────────────┘  │ read_at          │  │ course_title     │
                      │ created_at       │  │ created_at       │
                      └──────────────────┘  └──────────────────┘

┌──────────────────────┐  ┌──────────────────┐
│  project_service     │  │  sessions        │
│  (pivot)             │  ├──────────────────┤
├──────────────────────┤  │ id               │
│ project_id           │  │ user_id          │
│ service_id           │  │ payload          │
└──────────────────────┘  │ last_activity    │
                          └──────────────────┘
```

## 4. Notes
- Array/JSON columns (`scope[]`, `objectives[]`, `audience[]`, `curriculum[]`, `body[]`, `roles[]`) will be stored as JSON in MySQL or as text with JSON casting in Eloquent.
- The `project_service` pivot table links projects to their related services.
- `read_at` on inquiry/consultation/registration tables supports admin "unread" filtering.
- `source` fields track which form or page originated the submission.
- Session and cache tables support Laravel's database-backed session and cache drivers.
