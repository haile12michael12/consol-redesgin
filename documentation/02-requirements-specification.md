# 02 — Requirements Specification

## 1. Functional Requirements

### 1.1 Public Website
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Responsive, mobile-first layout across all pages (390 / 768 / 1024 / 1440 px breakpoints) | Must |
| FR-02 | Bilingual support — English and Amharic, switchable at any time | Must |
| FR-03 | Homepage with hero, company introduction, services overview, featured projects, training section, news, clients, and consultation CTA | Must |
| FR-04 | About section — company overview, history/timeline, leadership team, certifications & partnerships | Must |
| FR-05 | Services catalogue — construction management consultancy, business management consultancy, construction management software, engineering software | Must |
| FR-06 | Training & courses catalogue with category filtering | Must |
| FR-07 | Individual course detail pages (title, category, duration, certification body, summary, objectives, audience, curriculum) | Must |
| FR-08 | Projects portfolio with category/year/search filtering and pagination | Must |
| FR-09 | Individual project detail pages | Must |
| FR-10 | News listing with category filtering and pagination | Must |
| FR-11 | Individual news article pages with share actions | Must |
| FR-12 | Events listing and detail pages | Must |
| FR-13 | Contact page with inquiry form | Must |
| FR-14 | Consultation request form | Must |
| FR-15 | Training registration form | Must |
| FR-16 | Certifications page (Autodesk ATC, PMI ATP) | Must |
| FR-17 | Clients & partners page | Must |
| FR-18 | Site-wide search | Should |
| FR-19 | AI-powered assistant widget | Should |

### 1.2 Admin Panel
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | Authenticated admin login (email/password) | Must |
| FR-21 | Dashboard with summary metrics | Must |
| FR-22 | CRUD for services, projects, news, events, courses | Must |
| FR-23 | View and manage inquiries, consultation requests, training registrations | Must |
| FR-24 | Role-based access control | Should |
| FR-25 | Audit logging for admin actions | Should |

### 1.3 API
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-26 | RESTful JSON API for all public content | Must |
| FR-27 | Form submission endpoints with validation | Must |
| FR-28 | Sanctum-based authentication endpoints | Must |
| FR-29 | Rate limiting on form submissions | Must |
| FR-30 | CORS configuration for SPA origin | Must |

## 2. Non-Functional Requirements
| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | WCAG AA contrast compliance | Accessibility |
| NFR-02 | Keyboard-navigable menus and forms | Accessibility |
| NFR-03 | Reduced-motion preference support | Accessibility |
| NFR-04 | Page load < 3 s on 3G (Lighthouse) | Performance |
| NFR-05 | Route-level code splitting | Performance |
| NFR-06 | Image optimisation (WebP, lazy loading) | Performance |
| NFR-07 | HTTPS in production | Security |
| NFR-08 | CSRF protection via XSRF-TOKEN | Security |
| NFR-09 | Input sanitisation and validation (server-side) | Security |
| NFR-10 | 99.5% uptime target | Reliability |
| NFR-11 | Support latest 2 versions of Chrome, Firefox, Safari, Edge | Compatibility |

## 3. Content Requirements Pending CONSOL Approval
1. Reviewed Amharic translations for company statements.
2. Company profile PDF.
3. Business hours and exact office coordinates.
4. Written permission for client logos.
5. Approved client testimonials.
6. Leadership portraits and biographies.
7. Course syllabi, fees, schedules and instructors.
8. Privacy notice and terms of service.
