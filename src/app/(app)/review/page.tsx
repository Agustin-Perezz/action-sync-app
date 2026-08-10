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

  // Anonymous visitors or missing transcript see an empty review workspace.
  // The sync/add actions enforce auth via requireUser().
  let initialTasks: Task[] = [];
  let initialBoards: Board[] = [];
  if (user && transcriptId) {
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
