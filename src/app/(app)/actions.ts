"use server";

import { redirect } from "next/navigation";
import { extractTasksRequestDto } from "@/application/use-cases/transcripts/extract-tasks/extract-tasks.request.dto";
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { SIGNIN_PATH } from "@/lib/shared/infrastructure/auth-paths";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

const REVIEW_PATH = "/review";

export async function extractTasks(formData: FormData): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { transcripts } = createActionSyncContainer(supabase);

  const dto = extractTasksRequestDto.parse({
    userId: user.id,
    rawText: formData.get("rawText"),
  });

  const { transcriptId } = await transcripts.extractTasks.execute(dto);

  redirect(`${REVIEW_PATH}?transcript=${transcriptId}`);
}

export async function extractTasksFromText(rawText: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { transcripts } = createActionSyncContainer(supabase);

  const dto = extractTasksRequestDto.parse({
    userId: user.id,
    rawText,
  });

  const { transcriptId } = await transcripts.extractTasks.execute(dto);

  redirect(`${REVIEW_PATH}?transcript=${transcriptId}`);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(SIGNIN_PATH);
}
