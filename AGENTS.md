## Project

Next.js (App Router) starter with React 19, TypeScript strict mode, base-ui + shadcn components, Biome for lint/format, Playwright for E2E, and Sentry for monitoring.

## Commands

```bash
pnpm dev                # Start dev server
pnpm typecheck          # TypeScript type checking (tsc --noEmit)
pnpm lint               # Biome check
pnpm format             # Biome format --write
pnpm test               # Playwright E2E run (needs local Supabase)
pnpm test:ui            # Playwright UI mode
pnpm test:unit          # Vitest unit tests (no Supabase needed)
pnpm test:unit:coverage # Vitest unit tests + V8 coverage → coverage/unit/lcov.info
```

## Key Constraints

Never use magic strings—always use named constants or enums for values that could change or have semantic meaning.

Never declare inline types in function parameters—use type aliases instead.

Server Actions and data fetchers live in `actions.ts` with `"use server"`. Keep the `"use client"` boundary as low in the tree as possible—prefer Server Components and push client directives down to leaf components.

Required env vars must fail loudly—if missing, the app crashes, no defaults.

## Guidelines

If you need to write frontend code, see [Component Patterns](./docs/01_COMPONENT-PATTERNS.md) and [Frontend Folder Structure](./docs/02_FRONTEND-FOLDER-STRUCTURE.md).

If you need to write TypeScript, see [TypeScript Standards](./docs/03_TYPESCRIPT-STANDARDS.md).

If you need to understand the Clean Architecture layering, DI containers, and Supabase wiring, see [Architecture](./docs/04_ARCHITECTURE.md).

If you need to write tests, see Playwright patterns in the `tests/` directory and `playwright.config.ts` (E2E). For pure Clean Architecture logic (use-cases, entity validation, mappers, utilities), co-locate a `*.test.ts` next to the source and run it with Vitest — the use-case `*.repository.interface.ts` ports let you pass a fake repository with no Supabase. Unit tests cover the server/Supabase code that browser V8 coverage cannot see; both LCOVs feed SonarCloud.

Coverage scope is the **Clean Architecture core**: write unit tests for new use-cases, entity logic, and mappers. The outer layers are excluded from the coverage metric — DTOs (`*.dto.ts`), Zod schemas (`*.schema.ts`), enums, repository interfaces, Supabase repository implementations, server actions (`actions.ts`), presentational components, shadcn UI (`components/ui/**`), DI containers, env/Supabase/auth factories, Sentry config, instrumentation, app shell, route handlers, middleware, generated types, `errors.ts`, `utils.ts` — because they are E2E-covered, framework/config glue, or invisible to browser V8 coverage (Server Components, server actions). See `sonar.coverage.exclusions` / `vitest.config.ts`. Excluded files are still scanned for bugs/smells/duplication.

## Supabase

This project uses Supabase (Postgres + Auth + Storage) wired via `@supabase/ssr` for cookie-based auth in the Next.js App Router.

Required env vars (app crashes if missing — no defaults):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Local development:

```bash
supabase start             # Start local Supabase stack
supabase db pull           # Pull remote schema into a new local migration
supabase migration new <name>  # Create a blank migration file
supabase db push           # Apply local migrations to the linked project
supabase gen types --typescript --project-id <ref>  # Regenerate src/infrastructure/database/postgres/database.types.ts
supabase stop              # Stop local stack
```

Architecture layers (see [Architecture](./docs/04_ARCHITECTURE.md)):

- `src/domain/entities/` — pure entities + Zod invariant schemas, zero framework deps
- `src/application/use-cases/{feature}/{use-case}/` — use cases, repository interfaces, request/response DTOs
- `src/infrastructure/database/postgres/` — generated DB types, DB row aliases, mappers (one per entity), Supabase repo implementations
- `src/lib/containers/` — DI wiring (use cases ↔ concrete repositories)
- `src/lib/shared/infrastructure/` — Supabase server/browser clients, auth helpers
- `src/app/{feature}/actions.ts` — Server Actions construct the container per-request, never module-level singletons