import type { SupabaseClient } from "@supabase/supabase-js";
import type { DisconnectTrelloRepository } from "@/application/use-cases/trello/disconnect-trello/disconnect-trello.repository.interface";
import type { Database } from "../../database.types";

export class SupabaseDisconnectTrelloRepository
  implements DisconnectTrelloRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async delete(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("trello_connections")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete trello connection: ${error.message}`);
    }
  }
}
