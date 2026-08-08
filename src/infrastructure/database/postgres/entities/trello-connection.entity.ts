import type { Database } from "../database.types";

export type TrelloConnectionRow =
  Database["public"]["Tables"]["trello_connections"]["Row"];
export type TrelloConnectionInsert =
  Database["public"]["Tables"]["trello_connections"]["Insert"];
export type TrelloConnectionUpdate =
  Database["public"]["Tables"]["trello_connections"]["Update"];
