"use server";

import { revalidatePath } from "next/cache";
import type { TrelloList } from "@/application/ports/trello-client.port";
import { addManualTaskRequestDto } from "@/application/use-cases/tasks/add-manual-task/add-manual-task.request.dto";
import { deleteTaskRequestDto } from "@/application/use-cases/tasks/delete-task/delete-task.request.dto";
import { syncTasksToTrelloRequestDto } from "@/application/use-cases/tasks/sync-tasks-to-trello/sync-tasks-to-trello.request.dto";
import { updateTaskRequestDto } from "@/application/use-cases/tasks/update-task/update-task.request.dto";
import { getReviewDataRequestDto } from "@/application/use-cases/transcripts/get-review-data/get-review-data.request.dto";
import type { GetReviewDataResponseDto } from "@/application/use-cases/transcripts/get-review-data/get-review-data.response.dto";
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

const REVIEW_PATH = "/review";

export async function getReviewData(
  transcriptId: string,
): Promise<GetReviewDataResponseDto> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { transcripts } = createActionSyncContainer(supabase);

  const dto = getReviewDataRequestDto.parse({
    transcriptId,
    userId: user.id,
  });

  return await transcripts.getReviewData.execute(dto);
}

export async function getLists(boardId: string): Promise<TrelloList[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { trelloClient, getTrelloConnection } =
    createActionSyncContainer(supabase);

  // ponytail: getLists has no use case — it's a pure Trello pass-through after
  // the user picks a board. We resolve the connection row here to get the
  // token, then call TrelloClient directly. No domain logic to encapsulate.
  const connection = await getTrelloConnection().findByUserId(user.id);
  if (!connection) {
    return [];
  }

  return await trelloClient.getLists(boardId, connection.accessToken);
}

export async function updateTask(formData: FormData): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { tasks } = createActionSyncContainer(supabase);

  const dueDateRaw = formData.get("dueDate");
  const dto = updateTaskRequestDto.parse({
    id: formData.get("id"),
    userId: user.id,
    title: formData.get("title") ?? undefined,
    description: formData.get("description") ?? undefined,
    dueDate:
      dueDateRaw === null || dueDateRaw === "" ? null : (dueDateRaw as string),
  });

  await tasks.update.execute(dto);

  revalidatePath(REVIEW_PATH);
}

export async function deleteTask(taskId: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { tasks } = createActionSyncContainer(supabase);

  const dto = deleteTaskRequestDto.parse({ id: taskId, userId: user.id });

  await tasks.delete.execute(dto);

  revalidatePath(REVIEW_PATH);
}

export async function addManualTask(transcriptId: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { tasks } = createActionSyncContainer(supabase);

  const dto = addManualTaskRequestDto.parse({
    transcriptId,
    userId: user.id,
  });

  await tasks.addManual.execute(dto);

  revalidatePath(REVIEW_PATH);
}

export async function syncTasksToTrello(input: {
  transcriptId: string;
  listId: string;
}): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { tasks } = createActionSyncContainer(supabase);

  const dto = syncTasksToTrelloRequestDto.parse({
    transcriptId: input.transcriptId,
    userId: user.id,
    listId: input.listId,
  });

  await tasks.sync.execute(dto);

  revalidatePath(REVIEW_PATH);
}
