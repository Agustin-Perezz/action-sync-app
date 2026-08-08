import type { TrelloConnection } from "@/domain/entities/trello-connection.entity";

export interface GetTrelloConnectionRepository {
  findByUserId(userId: string): Promise<TrelloConnection | null>;
}
