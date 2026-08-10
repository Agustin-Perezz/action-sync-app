"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { connectTrelloRequestDto } from "@/application/use-cases/trello/connect-trello/connect-trello.request.dto";
import { disconnectTrelloRequestDto } from "@/application/use-cases/trello/disconnect-trello/disconnect-trello.request.dto";
import { getTrelloConnectionRequestDto } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.request.dto";
import type { GetTrelloConnectionResponseDto } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.response.dto";
import { createActionSyncContainer } from "@/lib/containers/action-sync.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { getTrelloApiKey } from "@/lib/shared/infrastructure/env";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

const TRELLO_AUTHORIZE_URL = "https://trello.com/1/authorize";
const TRELLO_SCOPES = "read,write";
const TRELLO_EXPIRATION = "30days";
const TRELLO_RESPONSE_TYPE = "token";
const TRELLO_CALLBACK_METHOD = "fragment";
const TRELLO_RETURN_PATH = "/trello/callback";

export async function initiateTrelloConnect(): Promise<string> {
  const apiKey = getTrelloApiKey();
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;
  const returnUrl = `${origin}${TRELLO_RETURN_PATH}`;

  const params = new URLSearchParams({
    expiration: TRELLO_EXPIRATION,
    scope: TRELLO_SCOPES,
    response_type: TRELLO_RESPONSE_TYPE,
    callback_method: TRELLO_CALLBACK_METHOD,
    key: apiKey,
    return_url: returnUrl,
  });

  return `${TRELLO_AUTHORIZE_URL}?${params}`;
}

export async function connectTrello(
  token: string,
): Promise<{ memberName: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { trello } = createActionSyncContainer(supabase);

  const dto = connectTrelloRequestDto.parse({
    userId: user.id,
    token,
  });

  const { memberName } = await trello.connect.execute(dto);

  revalidatePath("/settings");
  return { memberName };
}

export async function disconnectTrello(): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { trello } = createActionSyncContainer(supabase);

  const dto = disconnectTrelloRequestDto.parse({ userId: user.id });

  await trello.disconnect.execute(dto);

  revalidatePath("/settings");
}

export async function getTrelloConnection(): Promise<GetTrelloConnectionResponseDto> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { trello } = createActionSyncContainer(supabase);

  const dto = getTrelloConnectionRequestDto.parse({ userId: user.id });

  return await trello.getConnection.execute(dto);
}
