# 12 — Testing Plan

## 1. Testing Strategy Overview

| Level | Tool | Scope |
|-------|------|-------|
| Unit Tests | Vitest (frontend) / PHPUnit (backend) | Individual components, functions, models |
| Integration Tests | Vitest / PHPUnit | API service calls, database queries |
| Feature Tests | PHPUnit | Full HTTP request/response cycles |
| E2E Tests | Manual / Playwright (future) | User flows in real browser |
| Visual Tests | Manual | Layout at 390/768/1024/1440 px |
| Accessibility Tests | Manual + automated | WCAG AA compliance |

## 2. Frontend Tests (Vitest)

### Existing Tests (25 passing)
| Test File | Coverage |
|-----------|----------|
| Homepage render | Hero, services, projects sections render correctly |
| Services catalogue | Service cards display with correct data |
| Project records | Verified project data integrity |
| Course pages | No invented fees or dates displayed |
| 404 page | Not-found route renders correctly |
| Admin demo dashboard | Dashboard components render |
| Navigation CTA | Call-to-action buttons work |
| Language switch | Amharic translation loads correctly |
| Contact form validation | Required field validation |
| Consultation form validation | Required field validation |
| Assistant widget | Answers render |
| Error boundary | Errors caught and displayed |
| Data integrity | No fabricated data in published records |
| Palette contrast | WCAG AA contrast ratios verified |

### Additional Tests to Write
- [ ] All public page routes return 200
- [ ] API fallback renders demo data when API is unavailable
- [ ] Form submission success/error states
- [ ] Pagination navigation
- [ ] Category filtering
- [ ] Search functionality
- [ ] Admin login flow (mock)
- [ ] Mobile menu open/close
- [ ] Keyboard navigation through dropdowns

## 3. Backend Tests (PHPUnit)

### Unit Tests
- [ ] Model attribute casting (JSON fields)
- [ ] Model relationships (Service ↔ Project)
- [ ] Validation rules for each form request
- [ ] Slug generation

### Feature Tests
- [ ] `GET /api/health` returns 200
- [ ] `GET /api/services` returns JSON array
- [ ] `GET /api/projects?category=X` filters correctly
- [ ] `GET /api/projects/{slug}` returns single project or 404
- [ ] `GET /api/courses?category=X` filters correctly
- [ ] `GET /api/news?page=2` paginates correctly
- [ ] `POST /api/inquiries` with valid data returns 201
- [ ] `POST /api/inquiries` with missing fields returns 422
- [ ] `POST /api/auth/login` with valid credentials returns 200
- [ ] `POST /api/auth/login` with invalid credentials returns 401
- [ ] `GET /api/auth/me` without auth returns 401
- [ ] Rate limiting returns 429 after threshold
- [ ] Admin endpoints return 403 for non-admin users

## 4. Manual Testing Checklist

### Visual QA
- [ ] Homepage at 390px (mobile)
- [ ] Homepage at 768px (tablet)
- [ ] Homepage at 1024px (desktop)
- [ ] Homepage at 1440px (wide)
- [ ] All pages — no horizontal overflow
- [ ] All images load correctly
- [ ] Fonts render (Manrope, Instrument Serif, Noto Sans Ethiopic)
- [ ] Gold/navy colour scheme consistent

### Functional QA
- [ ] All navigation links work
- [ ] Mobile drawer opens and closes
- [ ] Escape key closes mobile drawer
- [ ] Dropdown menus open on hover/click
- [ ] Language switch toggles all visible text
- [ ] Contact form submits successfully
- [ ] Consultation form submits successfully
- [ ] Registration form submits successfully
- [ ] Form validation messages display
- [ ] Pagination controls work
- [ ] Category filters work
- [ ] Search returns relevant results
- [ ] Admin login works
- [ ] Admin CRUD operations work
- [ ] Logout clears session

### Accessibility QA
- [ ] Tab navigation through all interactive elements
- [ ] Screen reader announces page structure
- [ ] Focus indicators visible
- [ ] Skip-to-content link works
- [ ] Colour contrast passes WCAG AA
- [ ] Reduced motion respects user preference

## 5. Running Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && php artisan test
```
