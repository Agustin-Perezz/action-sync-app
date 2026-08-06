# next-supabase-scaffold

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_next-supabase-scaffold&metric=alert_status&token=488d382bfa2f8608447379c0b9438ba29f899556)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_next-supabase-scaffold)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_next-supabase-scaffold&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_next-supabase-scaffold)

A production-ready [Next.js](https://nextjs.org) starter structured around Clean Architecture with strict layering — domain entities and Zod invariant schemas at the core, application use cases depending only on repository interfaces, infrastructure providing Supabase-backed implementations, and the App Router delivery layer composing per-request DI containers rather than module-level singletons. Dependencies point inward toward the domain, so framework and I/O concerns stay at the edges. The scaffold takes a shift-left approach to quality: linting, type checking, static analysis, and E2E tests run on every push and pull request so issues surface as early as possible in the development cycle.

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
| Lint / Format   | Biome 2                                        |
| E2E             | Playwright (Chromium) + Monocart Reporter    |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Code quality    | SonarCloud (static analysis + Quality Gate)    |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Folder Structure

```
next-supabase-scaffold/
├── .github/
│   └── workflows/
│       └── ci.yml                # SonarQube, lint, typecheck, E2E, build, Snyk pipeline
├── docs/                         # Engineering guidelines
│   ├── 01_COMPONENT-PATTERNS.md
│   ├── 02_FRONTEND-FOLDER-STRUCTURE.md
│   ├── 03_TYPESCRIPT-STANDARDS.md
│   └── 04_ARCHITECTURE.md
├── public/                       # Static assets served at root
├── src/
│   ├── domain/                   # Pure entities + Zod invariant schemas (zero framework deps)
│   │   └── entities/
│   ├── application/              # Use cases, repository interfaces, request/response DTOs
│   │   └── use-cases/
│   ├── infrastructure/           # Supabase repos, DB row aliases, mappers (one per entity), generated types
│   │   └── database/
│   │       └── postgres/
│   ├── lib/
│   │   ├── containers/           # DI wiring (use cases ↔ concrete repositories)
│   │   ├── shared/
│   │   │   └── infrastructure/  # Supabase server/browser clients, env validation, auth helpers
│   │   └── utils.ts
│   ├── app/                      # App Router routes (pages, layouts, actions, proxy)
│   │   └── books/                # Sample Books feature (page, actions, components)
│   ├── components/
│   │   └── ui/                   # Reusable base-ui / shadcn primitives
│   └── proxy.ts                  # Session refresh via @supabase/ssr (formerly middleware.ts)
├── tests/                        # Playwright E2E specs + shared fixtures
├── playwright.config.ts          # Playwright config (monocart reporter, V8 coverage)
├── playwright.monocart-reporter.ts  # Monocart coverage + report config
├── biome.json                    # Linter & formatter config
├── sonar-project.properties       # SonarCloud analysis configuration
├── next.config.ts                # Next.js configuration
├── package.json
├── playwright.config.ts
└── tsconfig.json                 # Path alias: @/* -> ./src/*
```

See [`AGENTS.md`](./AGENTS.md) for the engineering conventions agents and contributors should follow.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables (app crashes if missing — no defaults):

   | Variable                                | Description                          |
   | --------------------------------------- | ------------------------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`              | Supabase project URL                 |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  | Supabase publishable (anon) key      |
   | `NEXT_PUBLIC_SENTRY_DSN`                | Sentry DSN (client + server)         |
   | `SENTRY_AUTH_TOKEN`                     | Sentry auth token for source map upload |
   | `SENTRY_ORG`                            | Sentry organization slug              |
   | `SENTRY_PROJECT`                        | Sentry project slug                   |

2. Install dependencies and Playwright browsers:

   ```bash
   pnpm install
   pnpm test:install
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000).

### Supabase Local Development

```bash
supabase start                          # Start local Supabase stack
supabase db pull                         # Pull remote schema into a new local migration
supabase migration new <name>            # Create a blank migration file
supabase db push                         # Apply local migrations to the linked project
supabase gen types --typescript --project-id <ref>  # Regenerate src/infrastructure/database/postgres/database.types.ts
supabase stop                            # Stop local stack
```

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start development server                  |
| `pnpm build`        | Production build                         |
| `pnpm start`        | Start production server                  |
| `pnpm lint`         | Run Biome lint & format checks           |
| `pnpm format`       | Auto-format with Biome                   |
| `pnpm typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |
| `pnpm test`         | Reset DB + run Playwright E2E tests       |
| `pnpm test:ui`      | Reset DB + run Playwright in UI mode      |
| `pnpm test:ci`      | Run Playwright only (no DB reset, for CI) |
| `pnpm test:install` | Install Playwright Chromium browser       |
| `pnpm test:show-report`     | Open Monocart HTML test report   |
| `pnpm coverage:show-report` | Open V8 coverage report          |

## Architecture

This project follows Clean Architecture with strict layering. See [Architecture](./docs/04_ARCHITECTURE.md) for the full guide.

```
src/
├── domain/            # Pure entities + Zod invariant schemas (zero framework deps)
├── application/       # Use cases, repository interfaces, request/response DTOs
├── infrastructure/    # Supabase repos, DB row aliases, mappers (one per entity), generated types
├── lib/containers/    # DI wiring (use cases ↔ concrete repositories)
└── app/               # Delivery layer (Server Components, Server Actions, UI components)
```

## Testing

The project has two complementary test layers, mapped to SonarCloud coverage:

- **Unit tests (Vitest)** — cover the pure Clean Architecture core (use-cases, schemas/DTOs, mappers, utilities) and the server/Supabase code that browser coverage cannot see (Server Actions, route handlers, repositories). Fast feedback, runs locally with no Supabase.
- **E2E tests (Playwright)** — Chromium-only, with V8 client-side coverage via the Monocart Reporter. Covers routes and client-rendered components end-to-end.

> **Why two layers?** Playwright's browser V8 coverage only captures client-side JS. Server Components, server actions, route handlers, middleware, and the Postgres/Supabase repositories execute on the server and are invisible to it. Vitest covers that surface; Playwright covers the rest. SonarCloud merges both LCOVs.

### Unit tests

```bash
pnpm test:unit            # run once
pnpm test:unit:coverage   # run with V8 coverage → coverage/unit/lcov.info
```

Unit tests are co-located next to the source they cover (`src/**/*.test.ts`) and run in the Node environment (no jsdom). The use-case repository interfaces (`*.repository.interface.ts`) make them dependency-free — pass a fake/in-memory repository, no Supabase required.

### Coverage scope: Clean Architecture core in, outer layers out

SonarCloud's coverage gate targets **logic, not volume**. The new-code gate (Clean as You Code) already limits the burden to code you add or change — not legacy. On top of that, only the **Clean Architecture core** is in the coverage metric; the outer layers are excluded (in both `sonar.coverage.exclusions` and Vitest's `coverage.exclude`) because they are exercised by E2E, are framework/config glue, or are invisible to browser V8 coverage (Server Components, server actions).

| In coverage scope (needs unit tests)       | Out of coverage scope (E2E / glue, no unit tests required) |
| ------------------------------------------ | --------------------------------------------------------- |
| Use-cases (`*.use-case.ts`)                | DTOs (`*.dto.ts`), Zod schemas (`*.schema.ts`), enums (`*.enum.ts`) |
| Entity validation (`book.entity.ts`)       | Repository interfaces (`*.repository.interface.ts`)       |
| Mappers (`*.mapper.ts`)                    | Supabase repository implementations, server actions (`actions.ts`) |
|                                            | Presentational components, shadcn UI (`components/ui/**`)  |
|                                            | DI containers, env/Supabase/auth factories, Sentry config, instrumentation |
|                                            | App shell, route handlers, middleware, generated types, `errors.ts`, `utils.ts` |

Excluded files are still analyzed for **bugs, smells, and duplication** — they just don't count toward the coverage %. Write unit tests for new use-cases, entity logic, and mappers; the outer layers are covered by E2E. Tradeoff: new infrastructure/presentation code is smell/bug-gated, not coverage-gated.

### E2E tests

### Prerequisites

Local Supabase must be running:

```bash
pnpm supabase:start
```

Copy `.env.test.example` to `.env.test` (or let `supabase start` generate defaults):

```bash
cp .env.test.example .env.test
```

### Test Structure

```
tests/
├── _shared/
│   ├── app-fixtures.ts              # Merged fixtures (coverage + supabase test client)
│   └── fixtures/
│       └── supabase-test-client.ts  # Supabase service client for seeding test data
├── books.test.ts                    # Books feature tests
└── smoke.test.ts                    # Smoke test
```

All tests import `test` and `expect` from `_shared/app-fixtures` (not directly from Playwright).

### Coverage Reports

| Format        | Path                                              |
| ------------- | ------------------------------------------------- |
| Monocart HTML | `./coverage/tests/monocart-report.html`           |
| V8 HTML (E2E) | `./coverage/tests/v8/index.html`                  |
| LCOV (E2E)    | `./coverage/tests/lcov.info`                      |
| LCOV (unit)   | `./coverage/unit/lcov.info`                      |
| Cobertura XML | `./coverage/tests/cobertura/code-coverage.cobertura.xml` |

SonarCloud reads both LCOV files (`sonar.*.lcov.reportPaths=coverage/unit/lcov.info,coverage/tests/lcov.info`) so unit + E2E coverage feed a single analysis.

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged`, which executes `biome check --staged` on staged files.
- **pre-push**: runs `pnpm typecheck && pnpm test`.

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests:

1. **lint** — Biome lint + TypeScript typecheck
2. **test** — E2E tests (Playwright + local Supabase + V8 coverage via Monocart Reporter); uploads the `test-report` (E2E coverage) artifact
3. **sonar** — SonarCloud static analysis + Quality Gate. **Runs after `test`**: it generates the Vitest unit coverage (`coverage/unit/lcov.info`), downloads the E2E coverage artifact (`coverage/tests/lcov.info`), then scans both so coverage is never missing from the report. PR decoration posts the gate status and inline issue comments to the PR.
4. **build** — Production build with Sentry source map upload (gated on lint + test)

A **snyk** job runs in parallel, scanning dependencies for high-severity vulnerabilities and uploading the results as SARIF to GitHub Code Scanning. It is allowed to continue on error so findings do not block the pipeline.

```
lint ──┐
       ├──> build
test ──┼──> sonar
snyk
```

### Required GitHub Configuration

Configure these in **Settings → Secrets and variables → Actions**.

**Secrets** (sensitive values):

| Secret              | Description                            |
| ------------------- | -------------------------------------- |
| `SONAR_TOKEN`       | SonarCloud analysis token               |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload |
| `SENTRY_ORG`        | Sentry organization slug               |
| `SENTRY_PROJECT`    | Sentry project slug                    |
| `SNYK_TOKEN`        | Snyk API token for vulnerability scans |

> **Note:** `SONAR_TOKEN` is the only SonarCloud secret you need to add manually. `GITHUB_TOKEN` is provided automatically by GitHub Actions. No `SONAR_HOST_URL` is required for SonarCloud.

**Variables** (public values, safe to expose):

| Variable                               | Description                     |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `NEXT_PUBLIC_SENTRY_DSN`               | Sentry DSN (client + server)    |

### Shift-left: SonarCloud gate on every PR

Coverage and code quality are enforced as early as possible (shift-left):

1. **IDE — SonarLint Connected Mode.** Install the SonarLint extension (VS Code / JetBrains) and bind it to SonarCloud organization `general-organization`, project `Agustin-Perezz_next-supabase-scaffold`. This syncs the quality profile and surfaces issues in-editor before commit, in agreement with CI.
2. **Pre-push — unit tests.** The Husky `pre-push` hook runs `pnpm test:unit` before the slower E2E suite, so pure-logic regressions fail fast locally.
3. **PR — analysis + decoration.** The `sonar` job runs on every PR, posts the Quality Gate status and inline issue comments to the PR (PR decoration, enabled by the job's `pull-requests: write` permission), and reports only *new* issues introduced by the PR.
4. **Merge gate — required check.** In **Settings → Branches → Branch protection rules** for `main`, add the **"SonarCloud Code Analysis"** check as a *required* status check so a failing Quality Gate blocks the merge.

On SonarCloud, keep the **New Code Definition** set to `previous_version` and leave the Quality Gate on the default **Sonar way** (new-code coverage ≥ 80%, no new issues, new duplication ≤ 3%). Do not raise an overall-coverage condition until the unit suite matures — new-code-only keeps the gate achievable for server-action / route code that is covered by E2E or excluded.

## Documentation

- [Component Patterns](./docs/01_COMPONENT-PATTERNS.md)
- [Frontend Folder Structure](./docs/02_FRONTEND-FOLDER-STRUCTURE.md)
- [TypeScript Standards](./docs/03_TYPESCRIPT-STANDARDS.md)
- [Architecture](./docs/04_ARCHITECTURE.md)