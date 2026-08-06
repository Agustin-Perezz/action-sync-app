# Frontend Folder Structure

## Shared Code

Cross-route frontend code lives under `src/components/`, `src/hooks/`, and `src/lib/`:

```
src/
├── components/
│   └── ui/                        # shadcn/ui primitives (button, dialog, etc.)
├── hooks/                         # reusable React hooks shared across routes
└── lib/
    └── utils.ts                   # cn() and other frontend utilities
```

Backend code (DI containers, Supabase clients, env) also lives under `src/lib/` (`@/lib/*`) — see the clean-architecture layers for details.

## Route Folder Pattern

Every route follows this structure:

```
src/app/{feature}/
├── page.tsx                       # Composition only — imports + arranges components
├── layout.tsx                     # Optional: route-level layout (keep flat, no nesting)
├── loading.tsx                    # Optional: Suspense fallback for the route
├── error.tsx                      # Optional: Error boundary for the route
├── actions.ts                     # Server Actions & data fetchers ("use server")
├── components/                    # Route-private components
│   ├── {Feature}Header.tsx        # Page title, description, action buttons
│   ├── {Feature}List.tsx          # Iterates items, delegates to card
│   ├── {Feature}EmptyState.tsx    # Empty list message/CTA
│   ├── {Feature}Card.tsx          # Single item display
│   ├── {Feature}CreateForm.tsx    # react-hook-form + zod wiring ("use client")
│   └── {Feature}FormFields.tsx    # Input fields only, no <form> tag
└── hooks/                         # Route-private hooks
    └── use{Feature}{Behavior}.ts  # e.g. useScrollSpy.ts, useProductFilters.ts
```

## Rules

- `page.tsx` is composition-only: imports and arranges components, nothing else. No logic, no inline styles, no conditionals beyond prop-passing. Server data fetching happens here (async Server Component) and the data is passed down as props.
- `actions.ts` handles all server logic: data fetchers and Server Actions (`"use server"`). See [Component Patterns](./01_COMPONENT-PATTERNS.md) for the container and use-case wiring pattern.
- `components/` holds every sub-component for that route. Component files are named with the feature prefix (e.g. `ProductCard`, not `Card`).
- `hooks/` holds hooks used only within that route. If a hook is needed by two or more routes, promote it to `src/hooks/`.
- Components that use hooks, events, or browser APIs must start with `"use client"`. Keep the server/client boundary as low in the tree as possible - prefer Server Components and push `"use client"` down to leaf components.
- Import shared UI via `@/components/ui/*`, shared hooks via `@/hooks/*`, and frontend utils via `@/lib/*`.

## Example

```
src/app/products/
├── page.tsx
├── actions.ts
├── components/
│   ├── ProductHeader.tsx
│   ├── ProductList.tsx
│   ├── ProductEmptyState.tsx
│   ├── ProductCard.tsx
│   ├── ProductCreateForm.tsx
│   └── ProductFormFields.tsx
└── hooks/
    └── useProductFilters.ts
```

## Root Layout

`src/app/layout.tsx` renders the `<html>`/`<body>` shell, fonts, and global providers (e.g. Toaster). No nested layouts unless strictly required.

```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

## Component Limits

Each component file has a 50-line hard limit. Split proactively at 40 lines. See [Component Patterns](./01_COMPONENT-PATTERNS.md) for details.