# 05 — Design System

## 1. Brand Identity

### Colour Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0a1628` | Primary backgrounds, header, footer |
| `--gold` | `#c8a951` | Primary accent, CTAs, highlights |
| `--gold-hover` | `#b8993f` | Button hover states |
| `--white` | `#ffffff` | Body background, text on dark |
| `--gray-50` | `#f8f9fa` | Alternate section backgrounds |
| `--gray-100` | `#e9ecef` | Borders, dividers |
| `--gray-600` | `#6c757d` | Secondary text |
| `--gray-900` | `#212529` | Body text |

All colour combinations meet **WCAG AA** contrast requirements for body, label and on-navy text.

### Typography
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Body / UI | Manrope (Variable) | 400–700 | All interface text |
| Display / Headings | Instrument Serif | 400 | Hero headlines, section headings |
| Amharic | Noto Sans Ethiopic | 400–700 | Amharic language content |

Fluid type scale — responsive font sizing without breakpoint jumps.

### Geometry
- **Border radius:** 3–6 px (square, corporate aesthetic)
- **No pill shapes, no rounded cards**
- **No decorative gradients**
- Spacious, unframed sections with generous whitespace

## 2. UI Primitives (`src/components/ui/`)

| Component | Variants | Notes |
|-----------|----------|-------|
| **Button** | `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `gold` | Supports `asChild` via Radix Slot |
| **Card** | — | Square corners, minimal shadow |
| **Badge** | — | Category/status labels |
| **Input / Textarea** | — | Consistent field styling |
| **Select** | — | Radix-based accessible select |
| **Field / Label** | — | Form field wrapper with label |
| **Dialog** | — | Radix-based modal |
| **Accordion** | — | Radix-based collapsible |
| **Tabs** | — | Radix-based tab interface |
| **Skeleton** | — | Loading placeholder |
| **Toaster** | — | Toast notifications (sonner) |
| **Tag** | — | Content tags |

## 3. Shared Components

### Common (`src/components/common/`)
- **Logo** — Company logo with responsive sizing
- **SectionHeading** — Eyebrow + heading + optional subtext
- **PageHero** — Full-width hero banner with breadcrumbs
- **Breadcrumbs** — Hierarchical navigation
- **Pagination** — Page-based list navigation
- **Lightbox** — Image gallery overlay
- **Reveal** — Scroll-triggered animation wrapper (Framer Motion)
- **SearchField** — Reusable search input
- **StatStrip / StateBlocks** — Company statistics display
- **AssistantWidget** — AI chat assistant
- **ErrorBoundary** — Graceful error display

### Layout (`src/components/layout/`)
- **SiteHeader** — Sticky header, utility bar, keyboard-accessible dropdown menus, mobile drawer
- **SiteFooter** — Contact info, navigation links, company details
- **LanguageSwitcher** — English ↔ Amharic toggle

## 4. Responsive Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | 390 px | Phones |
| Tablet | 768 px | Tablets, small laptops |
| Desktop | 1024 px | Standard desktop |
| Wide | 1440 px | Large displays |

## 5. Accessibility
- Semantic HTML (`nav`, `main`, `section`, `article`, `header`, `footer`)
- ARIA labels on interactive elements
- Skip-to-content link
- Focus-visible outlines
- `prefers-reduced-motion` media query guards on all animations
- Keyboard navigation for all menus and forms
