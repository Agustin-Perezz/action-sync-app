import type { Database } from "../database.types";

export type TranscriptRow = Database["public"]["Tables"]["transcripts"]["Row"];
export type TranscriptInsert =
  Database["public"]["Tables"]["transcripts"]["Insert"];
export type TranscriptUpdate =
  Database["public"]["Tables"]["transcripts"]["Update"];
