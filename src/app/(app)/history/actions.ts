"use server";

import { getSyncHistoryRequestDto } from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.request.dto";
import type { SyncHistoryEntry } from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.response.dto";
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getSyncHistory(): Promise<SyncHistoryEntry[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { transcripts } = createActionSyncContainer(supabase);

  const dto = getSyncHistoryRequestDto.parse({ userId: user.id });

  return await transcripts.getSyncHistory.execute(dto);
}
