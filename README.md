# CONSOL — Construction Solutions PLC website

Redesign of <https://www.constructionsolutionsplc.com/>.

| Folder | What it is |
| --- | --- |
| **`web/`** | The new CONSOL website — React 19 + Vite + JavaScript + Tailwind CSS v4 + React Router. Start here: [`web/README.md`](web/README.md) |
| `frontend/` | The pre-existing Lovable / TanStack Start prototype, left untouched and unmodified for reference. It is TypeScript-based and does not match the approved stack. |

```bash
cd web && npm install && npm run dev
```

Phase 1 (design system, navigation, homepage, public pages, forms, admin UI
shell) is documented in [`web/docs/phase-01.md`](web/docs/phase-01.md).

The Laravel backend is a separate project. This frontend only communicates with
it over REST using `VITE_API_BASE_URL`; no database, no secrets, no second
backend.
