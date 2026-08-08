import type { SupabaseClient } from "@supabase/supabase-js";
import { AddManualTaskUseCase } from "@/application/use-cases/tasks/add-manual-task/add-manual-task.use-case";
import { DeleteTaskUseCase } from "@/application/use-cases/tasks/delete-task/delete-task.use-case";
import { SyncTasksToTrelloUseCase } from "@/application/use-cases/tasks/sync-tasks-to-trello/sync-tasks-to-trello.use-case";
import { UpdateTaskUseCase } from "@/application/use-cases/tasks/update-task/update-task.use-case";
import { ExtractTasksUseCase } from "@/application/use-cases/transcripts/extract-tasks/extract-tasks.use-case";
import { GetReviewDataUseCase } from "@/application/use-cases/transcripts/get-review-data/get-review-data.use-case";
import { GetSyncHistoryUseCase } from "@/application/use-cases/transcripts/get-sync-history/get-sync-history.use-case";
import { ConnectTrelloUseCase } from "@/application/use-cases/trello/connect-trello/connect-trello.use-case";
import { DisconnectTrelloUseCase } from "@/application/use-cases/trello/disconnect-trello/disconnect-trello.use-case";
import { GetTrelloConnectionUseCase } from "@/application/use-cases/trello/get-trello-connection/get-trello-connection.use-case";
import { VercelAiExtractTasksAdapter } from "@/infrastructure/ai/extract-tasks.adapter";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseAddManualTaskRepository } from "@/infrastructure/database/postgres/repositories/tasks/supabase-add-manual-task.repository";
import { SupabaseDeleteTaskRepository } from "@/infrastructure/database/postgres/repositories/tasks/supabase-delete-task.repository";
import { SupabaseSyncTasksRepository } from "@/infrastructure/database/postgres/repositories/tasks/supabase-sync-tasks.repository";
import { SupabaseUpdateTaskRepository } from "@/infrastructure/database/postgres/repositories/tasks/supabase-update-task.repository";
import { SupabaseExtractTasksRepository } from "@/infrastructure/database/postgres/repositories/transcripts/supabase-extract-tasks.repository";
import { SupabaseGetReviewDataRepository } from "@/infrastructure/database/postgres/repositories/transcripts/supabase-get-review-data.repository";
import { SupabaseGetSyncHistoryRepository } from "@/infrastructure/database/postgres/repositories/transcripts/supabase-get-sync-history.repository";
import { SupabaseConnectTrelloRepository } from "@/infrastructure/database/postgres/repositories/trello/supabase-connect-trello.repository";
import { SupabaseDisconnectTrelloRepository } from "@/infrastructure/database/postgres/repositories/trello/supabase-disconnect-trello.repository";
import { SupabaseGetTrelloConnectionRepository } from "@/infrastructure/database/postgres/repositories/trello/supabase-get-trello-connection.repository";
import { TrelloClient } from "@/infrastructure/trello/trello.client";
import { getTrelloApiKey } from "@/lib/shared/infrastructure/env";

export function createActionSyncContainer(supabase: SupabaseClient<Database>) {
  // ponytail: one TrelloClient per request (stateless — token passed per-call).
  // apiKey resolved lazily so the env getter fires at request time, not import.
  const trelloClient = new TrelloClient(getTrelloApiKey());
  const extractTasksAdapter = new VercelAiExtractTasksAdapter();

  const connectTrelloRepository = new SupabaseConnectTrelloRepository(supabase);
  const disconnectTrelloRepository = new SupabaseDisconnectTrelloRepository(
    supabase,
  );
  const getTrelloConnectionRepository =
    new SupabaseGetTrelloConnectionRepository(supabase);
  const extractTasksRepository = new SupabaseExtractTasksRepository(supabase);
  const getReviewDataRepository = new SupabaseGetReviewDataRepository(supabase);
  const getSyncHistoryRepository = new SupabaseGetSyncHistoryRepository(
    supabase,
  );
  const updateTaskRepository = new SupabaseUpdateTaskRepository(supabase);
  const deleteTaskRepository = new SupabaseDeleteTaskRepository(supabase);
  const addManualTaskRepository = new SupabaseAddManualTaskRepository(supabase);
  const syncTasksRepository = new SupabaseSyncTasksRepository(supabase);

  return {
    trello: {
      connect: new ConnectTrelloUseCase(connectTrelloRepository, trelloClient),
      disconnect: new DisconnectTrelloUseCase(disconnectTrelloRepository),
      getConnection: new GetTrelloConnectionUseCase(
        getTrelloConnectionRepository,
      ),
    },
    transcripts: {
      extractTasks: new ExtractTasksUseCase(
        extractTasksRepository,
        extractTasksAdapter,
      ),
      getReviewData: new GetReviewDataUseCase(
        getReviewDataRepository,
        trelloClient,
      ),
      getSyncHistory: new GetSyncHistoryUseCase(getSyncHistoryRepository),
    },
    tasks: {
      update: new UpdateTaskUseCase(updateTaskRepository),
      delete: new DeleteTaskUseCase(deleteTaskRepository),
      addManual: new AddManualTaskUseCase(addManualTaskRepository),
      sync: new SyncTasksToTrelloUseCase(syncTasksRepository, trelloClient),
    },
    // Exposed for server actions that call TrelloClient directly (e.g. getLists
    // has no use case — it's a pure Trello pass-through after board selection).
    trelloClient,
    // Exposed so the getLists action can read the connection token without
    // constructing a second repo instance.
    getTrelloConnectionRepository,
  };
}
