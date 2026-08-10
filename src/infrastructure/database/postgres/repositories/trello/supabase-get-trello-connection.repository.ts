import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetTrelloConnectionRepository } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.repository.interface";
import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { Database } from "../../database.types";
import { trelloConnectionMapper } from "../../mappers/trello-connection.mapper";

export class SupabaseGetTrelloConnectionRepository
  implements GetTrelloConnectionRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByUserId(userId: string): Promise<TrelloConnection | null> {
    const { data, error } = await this.supabase
      .from("trello_connections")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch trello connection: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return trelloConnectionMapper.toDomain(data);
  }
}
