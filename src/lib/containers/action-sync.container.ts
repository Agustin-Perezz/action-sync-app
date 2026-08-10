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
  // ponytail: lazy getters — only the use case + deps a server action needs
  // are constructed per request. No eager allocation of all 10 use cases.
  let trelloClient: TrelloClient | null = null;
  let extractTasksAdapter: VercelAiExtractTasksAdapter | null = null;

  let connectTrelloRepo: SupabaseConnectTrelloRepository | null = null;
  let disconnectTrelloRepo: SupabaseDisconnectTrelloRepository | null = null;
  let getTrelloConnectionRepo: SupabaseGetTrelloConnectionRepository | null =
    null;
  let extractTasksRepo: SupabaseExtractTasksRepository | null = null;
  let getReviewDataRepo: SupabaseGetReviewDataRepository | null = null;
  let getSyncHistoryRepo: SupabaseGetSyncHistoryRepository | null = null;
  let updateTaskRepo: SupabaseUpdateTaskRepository | null = null;
  let deleteTaskRepo: SupabaseDeleteTaskRepository | null = null;
  let addManualTaskRepo: SupabaseAddManualTaskRepository | null = null;
  let syncTasksRepo: SupabaseSyncTasksRepository | null = null;

  function client(): TrelloClient {
    if (!trelloClient) {
      trelloClient = new TrelloClient(getTrelloApiKey());
    }
    return trelloClient;
  }

  function aiAdapter(): VercelAiExtractTasksAdapter {
    if (!extractTasksAdapter) {
      extractTasksAdapter = new VercelAiExtractTasksAdapter();
    }
    return extractTasksAdapter;
  }

  return {
    trello: {
      get connect() {
        if (!connectTrelloRepo) {
          connectTrelloRepo = new SupabaseConnectTrelloRepository(supabase);
        }
        return new ConnectTrelloUseCase(connectTrelloRepo, client());
      },
      get disconnect() {
        if (!disconnectTrelloRepo) {
          disconnectTrelloRepo = new SupabaseDisconnectTrelloRepository(
            supabase,
          );
        }
        return new DisconnectTrelloUseCase(disconnectTrelloRepo);
      },
      get getConnection() {
        if (!getTrelloConnectionRepo) {
          getTrelloConnectionRepo = new SupabaseGetTrelloConnectionRepository(
            supabase,
          );
        }
        return new GetTrelloConnectionUseCase(getTrelloConnectionRepo);
      },
    },
    transcripts: {
      get extractTasks() {
        if (!extractTasksRepo) {
          extractTasksRepo = new SupabaseExtractTasksRepository(supabase);
        }
        return new ExtractTasksUseCase(extractTasksRepo, aiAdapter());
      },
      get getReviewData() {
        if (!getReviewDataRepo) {
          getReviewDataRepo = new SupabaseGetReviewDataRepository(supabase);
        }
        return new GetReviewDataUseCase(getReviewDataRepo, client());
      },
      get getSyncHistory() {
        if (!getSyncHistoryRepo) {
          getSyncHistoryRepo = new SupabaseGetSyncHistoryRepository(supabase);
        }
        return new GetSyncHistoryUseCase(getSyncHistoryRepo);
      },
    },
    tasks: {
      get update() {
        if (!updateTaskRepo) {
          updateTaskRepo = new SupabaseUpdateTaskRepository(supabase);
        }
        return new UpdateTaskUseCase(updateTaskRepo);
      },
      get delete() {
        if (!deleteTaskRepo) {
          deleteTaskRepo = new SupabaseDeleteTaskRepository(supabase);
        }
        return new DeleteTaskUseCase(deleteTaskRepo);
      },
      get addManual() {
        if (!addManualTaskRepo) {
          addManualTaskRepo = new SupabaseAddManualTaskRepository(supabase);
        }
        return new AddManualTaskUseCase(addManualTaskRepo);
      },
      get sync() {
        if (!syncTasksRepo) {
          syncTasksRepo = new SupabaseSyncTasksRepository(supabase);
        }
        return new SyncTasksToTrelloUseCase(syncTasksRepo, client());
      },
    },
    // Exposed for server actions that call TrelloClient directly (e.g. getLists
    // has no use case — it's a pure Trello pass-through after board selection).
    get trelloClient() {
      return client();
    },
    // Exposed so the getLists action can read the connection token.
    getTrelloConnection: () => {
      if (!getTrelloConnectionRepo) {
        getTrelloConnectionRepo = new SupabaseGetTrelloConnectionRepository(
          supabase,
        );
      }
      return getTrelloConnectionRepo;
    },
  };
}
