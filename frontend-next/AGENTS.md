# Repository Guidelines

## Project Structure & Module Organization

This directory is the Next.js 16 frontend of the URL-LINK monorepo. Route files and layouts live in `app/`; reusable UI and feature components live in `components/`. Shared state, API helpers, types, configuration, translations, and global styles live in `lib/`. Static icons and images belong in `public/`. The FastAPI backend is in `../backend-fastapi` and communicates with this app over HTTP.

## Build, Test, and Development Commands

Use Node.js 24 and pnpm 10 or newer. Run commands from `frontend-next/`:

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the local server on port 5555.
- `pnpm build` creates a production build; `pnpm start` serves that build.
- `pnpm lint` checks ESLint rules; `pnpm typecheck` runs TypeScript without emitting files.
- `pnpm format` applies Prettier across the project. Review its diff before committing.

## Coding Style & Naming Conventions

Use TypeScript and TSX with two-space indentation, double quotes, and semicolons, following nearby files. Keep route segments and component files descriptive (`app/panel/[model]/page.tsx`, `components/panel/form/dynamic-form.tsx`). React components use PascalCase names; hooks use the `use` prefix. Prefer the `@/` import alias for project-root imports. ESLint checks import order, unused imports, and React hook rules; run `pnpm lint` after edits. Add shared visual primitives to `components/ui/` and theme values to `lib/assets/styles/globals.css`.

## Testing Guidelines

There is currently no `test` script, test suite, Playwright configuration, or coverage threshold. Playwright is installed as a development dependency but has not been wired up. For each change, run `pnpm lint` and `pnpm typecheck`; run `pnpm build` when changing routes, configuration, or rendering behavior. Describe any manual browser checks in the pull request. If you add tests, use descriptive `*.test.ts(x)` or `*.spec.ts(x)` names and document the command to run them.

## Commit & Pull Request Guidelines

The available Git history contains only an initial commit, so it does not establish a commit-message convention. Use short, imperative subjects that name the change. In pull requests, explain the behavior changed, link a relevant issue when one exists, list validation performed, and include screenshots for visible UI changes. Keep unrelated changes out of the same commit.

## Configuration & Security

Keep local settings in the ignored `.env` file. Set `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_NAME`, and `NEXT_PUBLIC_API_URL` for your environment; variables prefixed `NEXT_PUBLIC_` are exposed to the browser, so never put secrets in them. Do not commit credentials or generated `.next/` files.
