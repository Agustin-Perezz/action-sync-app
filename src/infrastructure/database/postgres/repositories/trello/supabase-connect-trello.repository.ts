import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConnectTrelloRepository } from "@/application/use-cases/trello/connect-trello/connect-trello.repository.interface";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { Database } from "../../database.types";
import { trelloConnectionMapper } from "../../mappers/trello-connection.mapper";

export class SupabaseConnectTrelloRepository
  implements ConnectTrelloRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async save(connection: TrelloConnection): Promise<TrelloConnection> {
    const payload = trelloConnectionMapper.toPersistence(connection);

    const { data, error } = await this.supabase
      .from("trello_connections")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save trello connection: ${error.message}`);
    }

    return trelloConnectionMapper.toDomain(data);
  }
}
