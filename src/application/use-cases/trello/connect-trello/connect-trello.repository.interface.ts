import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";

export interface ConnectTrelloRepository {
  save(connection: TrelloConnection): Promise<TrelloConnection>;
}
