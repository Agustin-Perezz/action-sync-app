import { Suspense } from "react";
import { getUser } from "@/lib/shared/infrastructure/auth.server";
import { getReviewData } from "./actions";
import { ReviewWorkspace } from "./components/ReviewWorkspace";
import type { Board, Task } from "./types";

export type ReviewPageProps = {
  readonly searchParams: Promise<{ readonly transcript?: string }>;
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const transcriptId = params.transcript ?? "";
  const user = await getUser();

  return (
    <Suspense fallback={<ReviewWorkspaceSkeleton />}>
      <ReviewWorkspaceLoader
        transcriptId={transcriptId}
        authenticated={!!user}
      />
    </Suspense>
  );
}

async function ReviewWorkspaceLoader({
  transcriptId,
  authenticated,
}: {
  transcriptId: string;
  authenticated: boolean;
}) {
  let initialTasks: Task[] = [];
  let initialBoards: Board[] = [];

  if (authenticated && transcriptId) {
    const data = await getReviewData(transcriptId);
    initialTasks = data.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      trelloCardId: task.trelloCardId,
    }));
    initialBoards = data.boards;
  }

  return (
    <ReviewWorkspace
      transcriptId={transcriptId}
      initialTasks={initialTasks}
      initialBoards={initialBoards}
    />
  );
}

function ReviewWorkspaceSkeleton() {
  return (
    <div>
      <div className="sticky top-14 z-10 flex flex-col gap-2 border-b bg-background/80 px-6 py-3 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-40 animate-pulse rounded bg-muted/50" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-muted/50" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted/50" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted/50" />
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted/50" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
    </div>
  );
}
