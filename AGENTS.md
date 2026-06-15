<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Paletti — palette editor

## Setup

- `FONTAWESOME_PACKAGE_TOKEN` env var required for `npm install`. Already set in `.env`.

## Commands

| Action            | Command              |
| ----------------- | -------------------- |
| Dev server        | `npm run dev`        |
| Build             | `npm run build`      |
| Lint              | `npm run lint`       |
| Test (single run) | `npm test`           |
| Test (watch)      | `npm run test:watch` |

## Testing

- **Vitest** with `jsdom` environment, globals enabled (`describe`/`it`/`expect` available without import)
- Test files co-located next to source as `*.test.ts` (e.g. `src/lib/color.test.ts`, `src/lib/url-state.test.ts`)
- Run a single file: `npx vitest run src/lib/color.test.ts`

## Architecture

- Single-page App Router Next.js app. The only page is `/` — `"use client"` with `dynamic(() => import("./AppContent"), { ssr: false })`.
- State in `usePalettes` (useReducer, no external lib). Palette state persisted in URL via `?p=` base64-encoded JSON (`useUrlSync`).
- No route handlers, API routes, or database.

## Tailwind v4

This project uses **Tailwind CSS v4** (`@tailwindcss/postcss`), not v3. Key differences:

- Use `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- Use `@custom-variant` instead of `@variants` or `dark:` class-based variants config
- Dark mode uses `.dark` class (not `prefers-color-scheme`), toggled via JS

## Color model

- Colors stored internally as **HSL** (h 0–360, s 0–100, l 0–100) in `Palette.colors`
- Display conversion uses **HSL → oklch** via `hslToOklch()` in `src/lib/color.ts`
- Import supports **oklch() CSS strings** and **hex** via `oklchToHsl()` / `hexToHsl()`
- Tailwind v4 `@theme` block import: parses `--color-{name}-{shade}` vars in `src/lib/import.ts`

## Formatting

- Code formatted with **Prettier** (config in `.prettierrc`). Run `npx prettier --write .` before committing.

## Commit conventions

Use semantic commits with one of these prefixes:

| Prefix      | When to use                            |
| ----------- | -------------------------------------- |
| `feat:`     | New feature or user-facing addition    |
| `fix:`      | Bug fix                                |
| `refactor:` | Code change without new feature or fix |
| `style:`    | Formatting, whitespace, Prettier-only  |
| `docs:`     | Documentation or AGENTS.md changes     |
| `chore:`    | Dependencies, tooling, config, build   |

Keep the subject line concise and lowercase after the prefix, e.g. `feat: add hue shift slider`.

## Path alias

`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
