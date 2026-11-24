# Module 01 — Global design system and website foundation

## 1. Objective
Provide a working, branded, accessible preview without modifying the existing CONSOL website. This module demonstrates the shared layout on `/`; it is not the completed Module 02 homepage.

## 2. Features and functionality
- Original logo and original city photograph, preserved through CDN asset pointers.
- Responsive company navigation with keyboard-accessible dropdowns and a mobile drawer.
- Verified company email, telephone and office information.
- Reusable buttons, cards, form primitives, dialogs, skeletons and error primitives already available in `src/components/ui/`.
- Root error and not-found states; page-specific metadata; branded favicon; skip-to-content link.
- Original company/service destinations retained rather than replaced with incomplete pages.

## 3. UI/UX design
Corporate navy and gold, Manrope typography, restrained 4–6px radii, spacious unframed sections and responsive layouts. All colors and reusable styles are defined in `src/styles.css`; interactive button variants are in `src/components/ui/button.tsx`. Reduced-motion preferences are respected.

## 4. User workflow
Open `/`, explore verified expertise areas, open dropdowns or mobile navigation, and follow links to the existing website. Contact actions open the original company contact page; email and telephone links use native mail/call handlers. No message or registration is claimed to have been stored.

## 5. Database requirements
None for this presentation foundation. The existing production database has not been accessed, changed or inspected. Database work waits for a later approved module and a compatibility review.

## 6. Backend API endpoints
No endpoints introduced and no private keys required. PHP/PDO/MySQL cannot execute in this managed TanStack Start preview. A runnable PHP foundation is deferred until source files, PHP/MySQL versions and hosting configuration can be inspected. No incompatible mock PHP API or duplicate backend has been created. Future hosted server operations require Lovable Cloud and approval where applicable.

## 7. Frontend components and pages
- `SiteHeader`: desktop navigation and mobile navigation drawer.
- `SiteFooter`: verified contact information and original company destinations.
- `/`: branded foundation preview with introductory cover, expertise previews and contact action.
- `Button`: gold, outline-on-cover, navigation and standard variants.
- Existing `src/components/ui/`: cards, inputs, labels, forms, dialogs, loading skeletons and alerts for future modules.

## 8. Folder/file structure
```text
src/
  assets/
    consol-addis-ababa.webp.asset.json
    consol-original-logo.webp.asset.json
  components/
    site-header.tsx
    site-footer.tsx
    ui/                 reusable existing UI primitives
  lib/
    site.ts             company details and verified original destinations
  routes/
    __root.tsx          shared shell and default metadata
    index.tsx           foundation preview and unique metadata
  test/
    app-routing.test.tsx
    site-policy.test.ts
  router.tsx            existing per-request QueryClient and typed router
  styles.css            global design system
public/favicon.png
docs/module-01.md
roadmap.md
AGENTS.md
```

## 9. Installation commands
From the project root (Node/Bun environment):
```sh
bun install
bun run dev
bunx vitest run src/test/app-routing.test.tsx src/test/site-policy.test.ts
```
The hosted preview already runs the development server. No new package dependency or environment variable was required. This project uses React 19, the managed Vite configuration, TanStack Start/Router and Tailwind v4, not React Router DOM or Laragon. Do not replace the managed routing/bootstrap. This is not yet a drop-in PHP shared-hosting deployment.

## 10. Implementation code
The complete working code is saved in the files listed above and available in the project code editor; no pseudocode or disconnected sample application is substituted. Component dependencies were created before importing them. Existing reusable UI primitives remain available for subsequent modules.

## 11. Testing instructions
Run the two test files above. In a browser verify `/` renders, all photos load, consultancy/training/certification menus open, Escape closes the mobile drawer, links point to original URLs, and no horizontal overflow occurs at desktop, tablet and mobile widths. Follow email and call links on an appropriate device. Review footer contact information against the original site before publication.

## 12. Expected results
A navy-and-gold branded preview, visible company identity, functioning dropdown/drawer navigation, original contact destinations and metadata. The existing production site remains untouched. There is no CMS, account system, registration storage, translated official content or new contact API yet.

## 13. Completion checklist
- [x] Existing homepage content, navigation URLs and footer reviewed.
- [x] Original logo, city photo and verified contact details retained.
- [x] Semantic design system, shared layout and responsive navigation implemented.
- [x] Metadata and favicon set.
- [x] URL preservation and routing tests added.
- [x] Three tests passed; browser checks passed at 1440px, 768px and 390px, with loaded images, working menus, preserved contact destination, no horizontal overflow and no page errors.
- [ ] CONSOL review and approval of Module 01.
- [ ] Existing PHP source/hosting/database compatibility review — requires backup and version details.
- [ ] Module 02 begins only after Module 01 review.

## Source audit
Reviewed https://www.constructionsolutionsplc.com/ on 24 November 2026. Original navigation includes Home, About Us, Training (construction management, construction management software, engineering software), Consultancy (construction/business management), Certification (Autodesk ATC, PMI ATP), Events, News and Contact Us. Original homepage also contains a training search, course listings, project listings and announcements; these are not removed from the live site and are reserved for their replacement modules. Original logo and skyline are reused; the skyline is illustrative company-site photography, **not a claim that CONSOL delivered the pictured building**. No unsupported metrics, new clients, deadlines, course availability, working hours or new achievements have been published. Original promotional discounts have not been carried over without current confirmation.

Source access does not reveal PHP version, database schema, hosting configuration or administration behavior; those remain unverified. The map link on the original site contains `undefined`, so no fabricated map pin is provided.