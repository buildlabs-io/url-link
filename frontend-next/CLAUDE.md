# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This directory (`frontend-next`) is the Next.js 16 (App Router) frontend half of the **URL-LINK** monorepo — a self-hosted URL shortener with click analytics. Its sibling, `../backend-fastapi`, is a FastAPI + PostgreSQL API that this app talks to exclusively over HTTP (no shared code/types between them). See `../README.md` for the full-stack setup (Postgres, GeoLite, Google OAuth env vars for the backend).

## Commands

```bash
pnpm dev              # dev server on port 5555
pnpm build            # production build
pnpm start            # run a production build
pnpm lint             # eslint .
pnpm lint:fix         # eslint --fix
pnpm format           # prettier --write .
pnpm typecheck        # tsc --noEmit
pnpm clean            # rm -rf .next tsconfig.tsbuildinfo
pnpm reinstall        # wipe .next/lockfile/node_modules and reinstall
```

There is no test script wired up (`@playwright/test` is a devDependency but no Playwright config or spec files currently exist in this directory).

Required env vars (`.env`): `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5007` if unset), `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_ANALYTICS`, `NEXT_PUBLIC_EMAIL_CONTACT`.

`push_to_prod.sh` rsyncs this directory into a separate sibling git repo and pushes it (Vercel deploys from there) — it's a manual deploy step with a hardcoded local path, not something to run incidentally.

## Architecture

### Generic "model" CRUD system

The panel is built around a single generic pattern rather than per-entity pages. `ModelType` (`lib/types/enums.ts`) currently has one member, `link`, but the table/form/store code is written to dispatch on it via switch statements, so adding a model means: extend `ModelType`, add a case to `get_form_by_model` (`lib/types/form.ts`), add a case to `get_columns_ag_by_model` (`lib/types/table.ts`), and extend `PanelStateProps.models` in `lib/store/panelSlice.ts`.

- **Routes**: `/panel/[model]` lists rows in an AG Grid; `/panel/form/[model]/[id]` is both add (`id === "add"`) and edit; `ModelFormContainer` (`components/panel/form/index.tsx`) derives form fields from the model's field factory and the row looked up by `findByKey`.
- **Data fetching**: SWR caches the panel's link list through `lib/utils/api.ts`. The provider in `lib/provider/swrProvider.tsx` wraps panel routes and the public report page, persists successful data in local storage, and refreshes mounted data every 30 seconds; logout clears the cache. The list uses `POST /{model}`; deletes use `DELETE /{model}` and revalidate the SWR key.
- **Table rendering**: `ag-grid-community`/`ag-grid-react`, modules registered once globally as a side effect of importing `lib/types/table.ts` (guarded by `globalThis.__agAllRegistered` to survive HMR). RTL is driven by `localeCache.isRtl()`, not a grid prop you set per-call.
- **Forms**: `DynamicForm`/`FieldRenderer` render from a `FormField[]` built by `create_form_fields`; `form_fields_to_data` coerces empty strings to `null` and numeric fields to `Number`.

### Auth

Not session/cookie-based despite appearances. On Google OAuth success (popup window posting a `message` event, see `components/pages/home/login-buttons.tsx`), the JWT is stored in `localStorage` (`token`, `token_expires_at`) and attached as `Authorization: Bearer` by `lib/utils/api.ts`. A separate, non-sensitive `auth_token` cookie (`"true"`/absent) exists only so `proxy.ts` (server-side) can redirect logged-in users without reading `localStorage`. A 401 response clears both and redirects to `/`. `app/panel/layout.tsx` is a client-side gate that checks token expiry on mount before rendering `SwrProvider`'s children — there is no server-side route protection for `/panel/*`.

Anonymous users can still create one link: the add-link flow detects a missing token and posts to a special pseudo-model `create` endpoint instead of `link`, then routes to the public `/report/[password_hash]` page instead of the authed `/panel/report/[alias]`. `components/shared/report.tsx` serves both via an `isPublic` prop.

### i18n / locale

Locales (`en`, `es`, `he`) are **not** always URL-prefixed: `/` is a statically-generated Hebrew page (`app/page.tsx`), while `/[lang]` statically pre-renders the same `HomeView` for each locale (`app/[lang]/page.tsx`, `generateStaticParams`). `localeCache` (`lib/config/locale-cache.ts`) is a module-level singleton read on both server (via the `NEXT_LOCALE` cookie in `app/layout.tsx`) and client (via `document.cookie`) — it is not React context, so updating it doesn't itself trigger a re-render; callers set the cookie and rely on navigation/`router.refresh()`. `proxy.ts` (Next 16's renamed `middleware.ts`) sets the `NEXT_LOCALE` cookie from the URL's language segment and redirects authed users away from `/` or any bare language root into `/panel/link`. Translation strings live in one file, `lib/assets/i18n/translations.json`, keyed by locale.

**Known gotcha (verified, pre-existing, unfixed):** because `localeCache` is a plain mutable singleton rather than request-scoped state, concurrent server-side renders on the same Node process can clobber each other's locale — e.g. navigating to `/en` while another request for `/he` is in flight can render the English page with `dir="rtl"` (visible as punctuation/alignment flipping). Reproduced via direct Playwright navigation with no code changes involved; not something the Tailwind migration introduced or touched. A real fix would need request-scoped state (e.g. `AsyncLocalStorage` or threading the locale through props) instead of the shared singleton.

### API layer

The fetch wrapper in `lib/utils/api.ts` uses `NEXT_PUBLIC_API_URL` and reads the JWT for each request. Forms POST to `/{model}/{id}` for both create and update; the backend distinguishes by whether `id` is numeric/`"add"`/the `create` pseudo-model.

### Misc

- Styling is Tailwind CSS v4 (CSS-first config, no `tailwind.config.*` — theme tokens live in an `@theme` block at the top of `lib/assets/styles/globals.css`) plus a small local primitive kit in `components/ui/` (`Button`/`IconButton`, `TextInput`/`SearchInput`, `Switch`, `Badge`, `Spinner`, `Dialog`) that stands in for what MUI used to provide. There is no MUI/emotion in this codebase anymore — don't reintroduce it; extend the `components/ui/` kit instead. Brand colors/font are CSS custom properties (`--color-bg`, `--color-text`, `--color-accent`, etc., plus `--font-assistant`/`--font-code` set by `next/font` in `app/layout.tsx`) promoted into Tailwind's theme namespace, so they're usable as ordinary utilities (`bg-bg`, `text-accent`, `font-mono`, …). `globals.css` also carries the accessibility bar's runtime-toggled overrides (`.high-contrast`, `.invert`, `.grayscale`, `.font-size-*`) — these target plain elements and a `.surface` hook class (for anything that paints its own background and needs to flip in high-contrast mode), not any component-library class names, so they survive future UI changes as long as new opaque-background elements get the `.surface` class.
- `apexcharts`/`react-apexcharts` render the analytics charts on report pages (colored with the brand accent/secondary tokens); AG Grid renders the breakdown tables there too, restyled to the brand palette via its legacy CSS-variable theming (`.ag-theme-quartz` overrides in `globals.css`), not the newer JS Theming API.
- Icons are `lucide-react` throughout.
- SEO/JSON-LD is centralized in `lib/utils/seo.ts` (`generateMetadataLayout`, `generateJsonLdHome`) rather than scattered per-page `<head>` logic.
- Path alias `@/*` maps to the project root (see `tsconfig.json`); some files instead import bare (`lib/types` without `@/`), which also resolves because `baseUrl` is `.` — both forms appear in the codebase.
- ESLint auto-removes unused imports/vars (`eslint-plugin-unused-imports`, error-level) and enforces import ordering/grouping — expect `lint:fix` to reorder imports, not just fix warnings.
