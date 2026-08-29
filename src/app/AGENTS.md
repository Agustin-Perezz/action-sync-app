# src/app/

Next.js App Router delivery layer.

- `page.tsx` = composition only — imports + arranges components, fetches server data. No logic, no inline styles.
- `actions.ts` = server actions ONLY — mutations with `"use server"` (forms, writes, redirects). Every action MUST call `requireUser()` first. Never put read-only queries here.
- `components/` = route-private components. Named with feature prefix (`TaskCard`, not `Card`). 50-line hard limit per file, enforced by Biome's `noExcessiveLinesPerFile` rule.
- `"use client"` only on leaf components that need hooks/events/browser APIs. Keep server/client boundary as low as possible.
- `hooks/` = route-private hooks. Promote to `src/hooks/` if used by 2+ routes.
- Import shared UI via `@/components/ui/*`, hooks via `@/hooks/*`, utils via `@/lib/*`.

## SOLID in the delivery layer

Next.js App Router makes it easy to violate SOLID without noticing — fat pages, god components, server actions that do everything. These rules keep the delivery layer honest.

**Single Responsibility** — each file has one job. `page.tsx` composes, `actions.ts` fetches/mutates via the container, components render one concern, hooks encapsulate one piece of UI state. If a file's description needs "and", split it.

**Open/Closed** — extend components through composition and props, not by editing their internals. Prefer slot patterns (`children`, render props) over branching logic inside a component for every new variant.

```tsx
// Bad — closed: every new variant adds a branch here
function TaskCard({ task, variant }: { task: Task; variant: "compact" | "detailed" | "admin" }) {
  if (variant === "compact") return <CompactLayout task={task} />;
  if (variant === "admin") return <AdminLayout task={task} />;
  return <DetailedLayout task={task} />;
}

// Good — open: new layouts don't touch this component
function TaskCard({ task, children }: { task: Task; children: React.ReactNode }) {
  return <article>{children}</article>;
}
// Call site: <TaskCard task={task}><AdminLayout task={task} /></TaskCard>
```

**Liskov Substitution** — a component must honour its prop contract. No "special" component that silently requires props it declares as optional, or returns a different shape than its siblings. If `TaskList` accepts `tasks: Task[]`, any component accepting `tasks: Task[]` is a valid drop-in replacement.

**Interface Segregation** — don't pass a fat object when a component needs two fields. Split props so components depend only on what they use.

```tsx
// Bad — TaskTitle depends on the entire Task, but only uses title
function TaskTitle({ task }: { task: Task }) {
  return <h2>{task.title}</h2>;
}

// Good — TaskTitle depends only on what it uses
function TaskTitle({ title }: { title: string }) {
  return <h2>{title}</h2>;
}
```

**Dependency Inversion** — delivery layer depends on container abstractions and DTOs, never concrete repositories or use case classes. `actions.ts` calls the container, which wires the use case to the repository interface. See [Architecture](../../docs/04_ARCHITECTURE.md) "Dependency rules".

```tsx
// Bad — delivery layer knows about the repository
import { SupabaseUpdateTaskRepository } from "@/infrastructure/database/postgres/repositories/tasks/supabase-update-task.repository";
const repo = new SupabaseUpdateTaskRepository(supabase);

// Good — delivery layer knows only the container
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
const container = createActionSyncContainer(supabase);
const useCase = container.tasks.update;
```

Page shape — composition only, data fetched here and passed down:

```tsx
export default async function ReviewPage() {
  const data = await getReviewData(transcriptId);
  return (
    <main>
      <ReviewHeader />
      <TaskList tasks={data.tasks} />
      <AddManualTaskButton />
    </main>
  );
}
```