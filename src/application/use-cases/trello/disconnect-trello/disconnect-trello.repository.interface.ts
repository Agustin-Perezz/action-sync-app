export interface DisconnectTrelloRepository {
  delete(userId: string): Promise<void>;
}
