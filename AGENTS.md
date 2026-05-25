# AGENTS.md

> AI agent guidance for the `erp` project.  
> This file describes the project as it actually exists today — not as a generic Next.js tutorial.

---

## Project Overview

`erp` is a brand-new [Next.js](https://nextjs.org) 14 application (v14.2.35) bootstrapped with `create-next-app`. It uses the **App Router** (`app/` directory) and is currently at the default template stage — no custom business logic, routes, or data models have been added yet.

- **Runtime**: Node.js
- **Language**: TypeScript 5 (strict mode enabled)
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS 3.4.1 + PostCSS 8
- **Package manager**: npm (lockfile present)

---

## Build, Dev, and Test Commands

All commands are run from the project root.

| Command         | Purpose                                                      |
|-----------------|--------------------------------------------------------------|
| `npm run dev`   | Start the Next.js development server on `http://localhost:3000` |
| `npm run build` | Create an optimized production build in `.next/`             |
| `npm run start` | Start the production server (requires `build` first)         |
| `npm run lint`  | Run Next.js built-in ESLint checks                           |

> **Note:** There is currently **no test runner** configured (no Jest, Vitest, Cypress, or Playwright). If you add tests, update this section and `package.json` scripts accordingly.

---

## Technology Stack Details

### Next.js Configuration
- Config file: `next.config.mjs`
- Current state: **empty/default** — no custom rewrites, redirects, or image domains configured yet.
- Output mode: standard (not `export`)

### TypeScript Configuration
- Config file: `tsconfig.json`
- `strict: true`
- Path alias: `@/*` maps to `./*` (project root)
- Module resolution: `bundler`
- JSX mode: `preserve` (handled by Next.js)

### Styling & Tailwind CSS
- Config file: `tailwind.config.ts`
- Content paths:
  - `./pages/**/*.{js,ts,jsx,tsx,mdx}`
  - `./components/**/*.{js,ts,jsx,tsx,mdx}`
  - `./app/**/*.{js,ts,jsx,tsx,mdx}`
- Theme extension:
  - `background` and `foreground` colors mapped to CSS custom properties (`var(--background)`, `var(--foreground)`)
- PostCSS config: `postcss.config.mjs` — registers Tailwind CSS plugin only
- Global styles: `app/globals.css`
  - Uses `@tailwind` directives
  - Defines `:root` CSS variables for light/dark mode (`prefers-color-scheme: dark`)
  - Includes a custom `text-balance` utility

### Fonts
- The project uses the **Geist** font family (Vercel's default font for new projects) loaded via `next/font/local`.
- Font files:
  - `app/fonts/GeistVF.woff`
  - `app/fonts/GeistMonoVF.woff`
- CSS variables: `--font-geist-sans`, `--font-geist-mono`

---

## Code Organization

```
app/
├── fonts/
│   ├── GeistVF.woff
│   └── GeistMonoVF.woff
├── favicon.ico
├── globals.css      # Global Tailwind imports + CSS variables
├── layout.tsx       # Root layout (html + body), loads Geist fonts
└── page.tsx         # Default landing page ("/")
```

- **No `pages/` directory** — this is a pure App Router project.
- **No `components/`, `lib/`, `hooks/`, or `utils/` directories** yet.
- **No API routes** yet (`app/api/` does not exist).

### Existing Files Behavior
- `app/layout.tsx`: Provides the root `<html>` and `<body>` tags. Applies Geist font CSS variables and `antialiased` class.
- `app/page.tsx`: Renders the default Next.js starter landing page with external links to Vercel and Next.js docs. Uses `next/image` for optimized images.

---

## Development Conventions

1. **File naming**: Use `.tsx` for components and pages, `.ts` for utilities/configs.
2. **Path aliases**: Import project files with `@/` (e.g., `import { foo } from "@/lib/foo"`).
3. **Styling**: Prefer Tailwind utility classes. Global styles should live in `app/globals.css` or be added via Tailwind theme extensions.
4. **Dark mode**: The project uses CSS `prefers-color-scheme: dark` with CSS custom properties. There is no manual theme toggle yet.
5. **Strict TypeScript**: All code is checked with `strict: true`. Avoid `@ts-ignore` without justification.

---

## Testing Instructions

**Current state:** No tests exist.

If you are asked to add tests, choose a framework (Jest + React Testing Library for unit tests, or Playwright/Cypress for E2E) and:
1. Install the necessary dev dependencies.
2. Add a test script to `package.json`.
3. Update this section with the run command and file locations.

---

## Security Considerations

- The project is a client-side rendered Next.js app with no backend API or database layer yet.
- No environment variables (`.env.local`) are present. If you add secrets, ensure they are listed in `.gitignore` (`.env*.local` is already ignored).
- No authentication or authorization logic exists.
- External images are loaded from `https://nextjs.org/icons/*` in `page.tsx` — if you replace these, verify image sources and consider adding domains to `next.config.mjs` `images.remotePatterns` when using `next/image`.

---

## Deployment Notes

- This is a standard Next.js application deployable to any Node.js host.
- The README suggests [Vercel](https://vercel.com) as the primary platform.
- Build output goes to `.next/` (ignored by `.gitignore`).
- Static export is **not** enabled (`output: 'export'` is absent from `next.config.mjs`).
