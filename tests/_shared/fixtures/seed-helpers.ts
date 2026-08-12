import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/infrastructure/database/postgres/database.types";

type TestClient = SupabaseClient<Database>;
type Tables = Database["public"]["Tables"];
type TranscriptRow = Tables["transcripts"]["Row"];
type TaskRow = Tables["tasks"]["Row"];
type TrelloConnectionRow = Tables["trello_connections"]["Row"];
type TranscriptStatus = Tables["transcripts"]["Insert"]["status"];

export type SeededTranscript = {
  transcript: TranscriptRow;
  tasks: TaskRow[];
};

export async function seedTranscriptWithTasks(
  client: TestClient,
  userId: string,
  prefix: string,
  taskTitles: string[],
  status: TranscriptStatus = "reviewing",
): Promise<SeededTranscript> {
  const transcriptId = crypto.randomUUID();

  const { data: transcript, error: tError } = await client
    .from("transcripts")
    .insert({
      id: transcriptId,
      user_id: userId,
      title: `${prefix}-transcript`,
      raw_text: `${prefix} raw text`,
      status,
    })
    .select()
    .single();

  if (tError || !transcript) {
    throw new Error(`Failed to seed transcript: ${tError?.message}`);
  }

  const taskRows = taskTitles.map((title) => ({
    id: crypto.randomUUID(),
    transcript_id: transcriptId,
    user_id: userId,
    title,
    description: `${prefix} description`,
    status: "draft" as const,
  }));

  const { data: tasks, error: taskError } = await client
    .from("tasks")
    .insert(taskRows)
    .select();

  if (taskError || !tasks) {
    throw new Error(`Failed to seed tasks: ${taskError?.message}`);
  }

  return { transcript, tasks };
}

export async function seedTrelloConnection(
  client: TestClient,
  userId: string,
): Promise<TrelloConnectionRow> {
  const { data, error } = await client
    .from("trello_connections")
    .insert({
      user_id: userId,
      trello_member_id: `member-${userId.slice(0, 8)}`,
      access_token: "fake-test-token",
      default_board_id: null,
      default_list_id: null,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to seed trello connection: ${error?.message}`);
  }

  return data;
}

export async function cleanupTestData(
  client: TestClient,
  userId: string,
): Promise<void> {
  await client.from("tasks").delete().eq("user_id", userId);
  await client.from("transcripts").delete().eq("user_id", userId);
  await client.from("trello_connections").delete().eq("user_id", userId);
}

export async function getTaskFromDb(
  client: TestClient,
  taskId: string,
): Promise<TaskRow | null> {
  const { data, error } = await client
    .from("tasks")
    .select()
    .eq("id", taskId)
    .single();

  if (error) return null;
  return data;
}

export async function getTrelloConnectionFromDb(
  client: TestClient,
  userId: string,
): Promise<TrelloConnectionRow | null> {
  const { data, error } = await client
    .from("trello_connections")
    .select()
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}
