import { cache } from "react";
import { getTrelloConnectionRequestDto } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.request.dto";
import type { GetTrelloConnectionResponseDto } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.response.dto";
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

async function fetchTrelloConnectionStatus(): Promise<GetTrelloConnectionResponseDto> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { trello } = createActionSyncContainer(supabase);
  const dto = getTrelloConnectionRequestDto.parse({ userId: user.id });
  return await trello.getConnection.execute(dto);
}

// ponytail: layout + page both call this — cache() collapses to one DB query
// per request instead of two identical round trips.
export const getTrelloConnectionStatus = cache(fetchTrelloConnectionStatus);
