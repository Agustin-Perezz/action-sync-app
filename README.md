# ActionSync

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_action-sync-app&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_action-sync-app)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_action-sync-app&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_action-sync-app)

Upload meeting transcripts, extract actionable tasks with AI, review and edit them, and sync to Trello. Built on Next.js (App Router) with Supabase, Clean Architecture, and Playwright E2E.

## How it works

1. **Upload** — Paste a `.txt` meeting transcript or drag a file into the dropzone.
2. **Extract** — OpenAI parses the transcript and creates draft tasks (title, description, due date).
3. **Review** — Edit task titles, descriptions, and due dates. Add manual tasks or delete irrelevant ones.
4. **Sync** — Pick a Trello board and list, then sync all draft tasks as Trello cards.
5. **History** — Every transcript appears in the sync history with task counts and status pills.

## Tech Stack

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| UI runtime      | React 19                                       |
| Language        | TypeScript (strict)                           |
| Components      | base-ui + shadcn                               |
| Styling         | Tailwind CSS v4                                |
| Forms           | react-hook-form + zod                          |
| Database        | Supabase (Postgres + Auth + Storage)           |
| Supabase client | `@supabase/ssr` (cookie-based SSR auth)        |
| AI              | Vercel AI SDK + OpenAI (`gpt-4o`)              |
| Trello          | Trello REST API (client-token OAuth)           |
| Lint / Format   | Biome 2                                        |
| E2E             | Playwright (Chromium) + Monocart Reporter      |
| Unit            | Vitest (V8 coverage)                           |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Code quality    | SonarCloud (static analysis + Quality Gate)    |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Folder Structure

```
action-sync-app/
├── .github/workflows/ci.yml        # Lint, E2E, build, Sonar, Snyk pipeline
├── docs/                           # Engineering guidelines
├── src/
│   ├── domain/                     # Pure entities + Zod schemas (task, transcript, trello-connection)
│   ├── application/                # Use cases + repository interfaces + DTOs
│   │   └── use-cases/
│   │       ├── auth/               # Magic link + OAuth
│   │       ├── tasks/              # Add, delete, update, sync to Trello
│   │       ├── transcripts/        # Extract tasks, get review data, sync history
│   │       └── trello/             # Connect, disconnect, get connection
│   ├── infrastructure/             # Supabase repos, Trello client, OpenAI adapter, mappers
│   ├── lib/
│   │   ├── containers/             # DI wiring (use cases ↔ concrete repos)
│   │   └── shared/infrastructure/  # Supabase clients, env validation, auth helpers
│   ├── app/                        # App Router delivery layer
│   │   ├── (app)/                  # Protected routes (layout guards via requireUser)
│   │   │   ├── page.tsx            # Upload dashboard
│   │   │   ├── review/             # Task review workspace
│   │   │   ├── history/            # Sync history list
│   │   │   └── settings/           # Trello connection settings
│   │   ├── signin/                 # Magic link + OAuth sign-in
│   │   ├── auth/callback/          # OAuth code exchange redirect
│   │   └── trello/callback/        # Trello token capture (fragment)
│   ├── components/ui/              # base-ui / shadcn primitives
│   └── proxy.ts                    # Session refresh middleware
├── tests/                          # Playwright E2E specs + fixtures
├── supabase/migrations/            # Schema (trello_connections, transcripts, tasks + RLS)
├── playwright.config.ts
├── vitest.config.ts
└── sonar-project.properties
```

See [`AGENTS.md`](./AGENTS.md) for engineering conventions.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables (app crashes if missing — no defaults):

   | Variable                                | Description                          |
   | --------------------------------------- | ------------------------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`              | Supabase project URL                 |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  | Supabase publishable key             |
   | `TRELLO_API_KEY`                        | Trello API key (from trello.com/power-ups) |
   | `OPENAI_API_KEY`                        | OpenAI API key                       |
   | `NEXT_PUBLIC_SENTRY_DSN`                | Sentry DSN (client + server)         |
   | `SENTRY_AUTH_TOKEN`                     | Sentry auth token for source maps    |
   | `SENTRY_ORG`                            | Sentry organization slug             |
   | `SENTRY_PROJECT`                        | Sentry project slug                  |

   Optional config values (have defaults):

   | Variable               | Default                  |
   | ---------------------- | ------------------------ |
   | `TRELLO_API_BASE_URL`  | `https://api.trello.com/1` |
   | `AI_MODEL`             | `gpt-4o`                 |

2. Install dependencies and Playwright browsers:

   ```bash
   pnpm install
   pnpm test:install
   ```

3. Start local Supabase:

   ```bash
   supabase start
   supabase db reset
   ```

4. Start the dev server:

   ```bash
   pnpm dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000).

### Supabase Local Development

```bash
supabase start                                # Start local Supabase stack
supabase db reset                              # Apply migrations + seed
supabase migration new <name>                  # Create a blank migration
supabase db push                               # Apply migrations to linked project
supabase gen types --lang typescript --local   # Regenerate database.types.ts
supabase stop                                  # Stop local stack
```

## Scripts

| Script                    | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `pnpm dev`                | Start development server                        |
| `pnpm build`              | Production build                                |
| `pnpm start`              | Start production server                         |
| `pnpm lint`               | Biome lint & format checks                      |
| `pnpm format`             | Auto-format with Biome                          |
| `pnpm typecheck`          | TypeScript type checking (`tsc --noEmit`)       |
| `pnpm test`               | Playwright E2E tests                            |
| `pnpm test:reset`         | Reset DB + run E2E tests                        |
| `pnpm test:ui`            | Playwright in UI mode                           |
| `pnpm test:ci`            | Playwright only (for CI, no DB reset)           |
| `pnpm test:install`       | Install Playwright Chromium browser             |
| `pnpm test:unit`          | Vitest unit tests (no Supabase needed)          |
| `pnpm test:unit:coverage` | Vitest + V8 coverage → `coverage/unit/lcov.info` |
| `pnpm test:show-report`   | Open Monocart HTML test report                  |
| `pnpm supabase:start`     | Start local Supabase                            |
| `pnpm supabase:stop`      | Stop local Supabase                             |
| `pnpm supabase:reset`     | Reset local Supabase database                   |
| `pnpm supabase:gen-types` | Regenerate `database.types.ts` from local schema |

## Architecture

Clean Architecture with strict layering — dependencies point inward toward the domain.

```
src/
├── domain/            # Pure entities + Zod invariant schemas (zero framework deps)
├── application/       # Use cases, repository interfaces, request/response DTOs
├── infrastructure/    # Supabase repos, Trello client, OpenAI adapter, mappers
├── lib/containers/    # DI wiring (use cases ↔ concrete repositories)
└── app/               # Delivery layer (Server Components, Server Actions, UI)
```

See [Architecture](./docs/04_ARCHITECTURE.md) for the full guide.

## Testing

Two complementary test layers:

- **Unit tests (Vitest)** — Clean Architecture core: use-cases, entity validation, mappers. Fast, no Supabase needed. Fake repos via `*.repository.interface.ts` ports.
- **E2E tests (Playwright)** — Full browser-driven tests against local Supabase. Auth fixtures create real users per test and inject session cookies. DB-integration tests seed real data via service role and assert mutations hit the database.

### E2E test structure

```
tests/
├── _shared/
│   ├── app-fixtures.ts              # testUser + authenticatedPage + coverage fixtures
│   └── fixtures/
│       ├── auth-fixtures.ts          # createTestUser, deleteTestUser, signInAndGetCookies
│       ├── seed-helpers.ts           # Seed transcripts, tasks, trello connections + cleanup
│       └── supabase-test-client.ts   # Service role client (bypasses RLS)
├── smoke.test.ts                    # Home page heading
├── upload.test.ts                   # Dropzone, textarea, extract btn, Trello banner, sidebar
├── review.test.ts                   # Empty state, board/list selectors
├── review-db.test.ts                # Seeded tasks display, add/delete/edit → DB verification
├── settings.test.ts                 # Heading, Trello card, disconnected state
├── settings-db.test.ts              # Connected state, disconnect → DB row removed
├── history.test.ts                  # Empty state
├── history-db.test.ts               # Seeded transcripts, task counts, status pills, review links
├── signin.test.ts                   # Page renders, magic link success, no sidebar
├── auth-callback.test.ts            # No params / invalid code → redirect home
├── trello-callback.test.ts          # No token error, fake token failure
├── redirects.test.ts                # Unauthenticated → /signin for all protected routes
└── navigation.test.ts               # Header email, logout, sidebar nav, mobile sheet, amber dot
```

### Running tests

```bash
supabase start                   # Start local Supabase
pnpm test                        # Run E2E suite
pnpm test:ui                     # Playwright UI mode
pnpm test:reset                  # Reset DB + run E2E (use after migration changes)
pnpm test:unit                   # Run unit tests (no Supabase needed)
pnpm test:unit:coverage          # Unit tests + V8 coverage
```

### Coverage

SonarCloud receives a single unit-only LCOV feed:

| Feed                     | Source      | Scope                                      |
| ------------------------ | ----------- | ------------------------------------------ |
| `coverage/unit/lcov.info`  | Vitest      | Use-cases, entity validation, mappers      |

Coverage scope = the Clean Architecture core, defined once in `vitest.config.ts` `coverage.include` (`**/*.use-case.ts`, `src/domain/entities/**/*.entity.ts`, `**/*.mapper.ts`). New outer files land outside coverage by default — zero exclusion-list maintenance. E2E coverage (Playwright/Monocart) stays local for debugging but is not fed to Sonar: browser V8 coverage cannot see Server Components, server actions, or the domain core. Outer layers are still analyzed for bugs, smells, and duplication; they are not coverage-gated.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests:

```
lint ─────────────┐
unit-test ─> sonar┼──> build
test ─────────────┤
snyk
```

1. **lint** — Biome lint + TypeScript typecheck
2. **unit-test** — Vitest unit tests + V8 coverage; uploads the LCOV artifact
3. **sonar** — SonarCloud analysis (runs after unit-test, downloads the unit LCOV artifact, scans)
4. **test** — E2E tests with local Supabase (Supabase Docker images cached); traces uploaded on failure
5. **build** — Production build with Sentry source maps (gated on lint + test)
6. **snyk** — Dependency vulnerability scan (SARIF → GitHub Code Scanning, non-blocking)

### Required GitHub Secrets

| Secret              | Description                            |
| ------------------- | -------------------------------------- |
| `SONAR_TOKEN`       | SonarCloud analysis token              |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload |
| `SENTRY_ORG`        | Sentry organization slug               |
| `SENTRY_PROJECT`    | Sentry project slug                    |
| `SNYK_TOKEN`        | Snyk API token                         |

### Required GitHub Variables

| Variable                               | Description                     |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key        |
| `NEXT_PUBLIC_SENTRY_DSN`               | Sentry DSN (client + server)    |

## Git Hooks

Husky manages Git hooks:

- **pre-commit**: `nano-staged` runs `biome check --staged` on staged files
- **pre-push**: `pnpm typecheck && pnpm test`

Hooks install automatically via the `prepare` script on `pnpm install`.

## Documentation

- [Component Patterns](./docs/01_COMPONENT-PATTERNS.md)
- [Frontend Folder Structure](./docs/02_FRONTEND-FOLDER-STRUCTURE.md)
- [TypeScript Standards](./docs/03_TYPESCRIPT-STANDARDS.md)
- [Architecture](./docs/04_ARCHITECTURE.md)