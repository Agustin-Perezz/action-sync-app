import { describe, expect, it, vi } from "vitest";
import type { TrelloClientPort } from "@/application/ports/trello-client.port";
import {
  TrelloApiError,
  TrelloConnectionNotFoundError,
} from "@/domain/entities/errors";
import { Task } from "@/domain/entities/task.entity";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { SyncTasksRepository } from "./sync-tasks-to-trello.repository.interface";
import { SyncTasksToTrelloUseCase } from "./sync-tasks-to-trello.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";
const LIST_ID = "list-abc";
const TOKEN = "tok-abc";

function makeConnection(): TrelloConnection {
  return TrelloConnection.create({
    id: "00000000-0000-4000-8000-000000000002",
    userId: USER_ID,
    trelloMemberId: "member123",
    accessToken: TOKEN,
  });
}

function makeDraftTask(
  id: string,
  title: string,
  dueDate: string | null = null,
): Task {
  return Task.create({
    id,
    transcriptId: TRANSCRIPT_ID,
    userId: USER_ID,
    title,
    description: `Desc for ${title}`,
    dueDate,
  });
}

function makeFakeTrelloClient(
  createCardImpl: TrelloClientPort["createCard"],
): TrelloClientPort {
  return {
    getMember: vi.fn(),
    getBoards: vi.fn(),
    getLists: vi.fn(),
    createCard: vi.fn(createCardImpl),
  };
}

function makeRepo(overrides: Partial<SyncTasksRepository> = {}): {
  repo: SyncTasksRepository;
  calls: Record<string, ReturnType<typeof vi.fn>>;
} {
  const calls = {
    findTrelloConnection: vi.fn(async () => makeConnection()),
    findDraftTasksByTranscript: vi.fn(async () => [] as Task[]),
    markSynced: vi.fn(async () => undefined),
    updateTranscriptStatus: vi.fn(async () => undefined),
  };
  const repo: SyncTasksRepository = { ...calls, ...overrides };
  return { repo, calls };
}

describe("SyncTasksToTrelloUseCase", () => {
  it("syncs all draft tasks and marks the transcript completed on full success", async () => {
    const tasks = [
      makeDraftTask(
        "00000000-0000-4000-8000-000000000011",
        "Task 1",
        "2026-01-15",
      ),
      makeDraftTask("00000000-0000-4000-8000-000000000012", "Task 2", null),
      makeDraftTask("00000000-0000-4000-8000-000000000013", "Task 3"),
    ];
    const { repo, calls } = makeRepo({
      findDraftTasksByTranscript: vi.fn(async () => tasks),
    });
    const trelloClient = makeFakeTrelloClient(async (input) => ({
      id: `card-${input.name}`,
      url: `https://trello.com/c/${input.name}`,
    }));
    const useCase = new SyncTasksToTrelloUseCase(repo, trelloClient);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      listId: LIST_ID,
    });

    expect(trelloClient.createCard).toHaveBeenCalledTimes(3);
    expect(calls.markSynced).toHaveBeenCalledTimes(3);
    expect(calls.markSynced).toHaveBeenNthCalledWith(
      1,
      tasks[0].id,
      "card-Task 1",
    );
    expect(calls.updateTranscriptStatus).toHaveBeenLastCalledWith(
      TRANSCRIPT_ID,
      TRANSCRIPT_STATUS.COMPLETED,
    );
    expect(result).toEqual({ syncedCount: 3 });
  });

  it("stops on first card failure, leaves remaining tasks draft and transcript reviewing, and names the failed task", async () => {
    const tasks = [
      makeDraftTask("00000000-0000-4000-8000-000000000011", "Task 1"),
      makeDraftTask("00000000-0000-4000-8000-000000000012", "Task 2"),
      makeDraftTask("00000000-0000-4000-8000-000000000013", "Task 3"),
    ];
    const { repo, calls } = makeRepo({
      findDraftTasksByTranscript: vi.fn(async () => tasks),
    });
    const trelloClient = makeFakeTrelloClient(async (input) => {
      if (input.name === "Task 2") {
        throw new Error("Trello 500");
      }
      return {
        id: `card-${input.name}`,
        url: `https://trello.com/c/${input.name}`,
      };
    });
    const useCase = new SyncTasksToTrelloUseCase(repo, trelloClient);

    const promise = useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      listId: LIST_ID,
    });
    await expect(promise).rejects.toThrow(TrelloApiError);
    await expect(promise).rejects.toThrow("Task 2");

    expect(trelloClient.createCard).toHaveBeenCalledTimes(2);
    expect(calls.markSynced).toHaveBeenCalledTimes(1);
    expect(calls.markSynced).toHaveBeenCalledWith(tasks[0].id, "card-Task 1");
    expect(calls.updateTranscriptStatus).not.toHaveBeenCalledWith(
      TRANSCRIPT_ID,
      TRANSCRIPT_STATUS.COMPLETED,
    );
  });

  it("omits the due param when the task dueDate is null (TrelloClient handles undefined)", async () => {
    const task = makeDraftTask(
      "00000000-0000-4000-8000-000000000011",
      "No due",
      null,
    );
    const { repo } = makeRepo({
      findDraftTasksByTranscript: vi.fn(async () => [task]),
    });
    const createCard = vi.fn(async (input) => ({
      id: `card-${input.name}`,
      url: `https://trello.com/c/${input.name}`,
    }));
    const trelloClient: TrelloClientPort = {
      getMember: vi.fn(),
      getBoards: vi.fn(),
      getLists: vi.fn(),
      createCard,
    };
    const useCase = new SyncTasksToTrelloUseCase(repo, trelloClient);

    await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      listId: LIST_ID,
    });

    expect(createCard).toHaveBeenCalledWith(
      { idList: LIST_ID, name: "No due", desc: "Desc for No due", due: null },
      TOKEN,
    );
  });

  it("completes the transcript with zero Trello calls when there are no draft tasks", async () => {
    const { repo, calls } = makeRepo({
      findDraftTasksByTranscript: vi.fn(async () => []),
    });
    const createCard = vi.fn();
    const trelloClient: TrelloClientPort = {
      getMember: vi.fn(),
      getBoards: vi.fn(),
      getLists: vi.fn(),
      createCard,
    };
    const useCase = new SyncTasksToTrelloUseCase(repo, trelloClient);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
      listId: LIST_ID,
    });

    expect(createCard).not.toHaveBeenCalled();
    expect(calls.markSynced).not.toHaveBeenCalled();
    expect(calls.updateTranscriptStatus).toHaveBeenCalledWith(
      TRANSCRIPT_ID,
      TRANSCRIPT_STATUS.COMPLETED,
    );
    expect(result).toEqual({ syncedCount: 0 });
  });

  it("throws TrelloConnectionNotFoundError and touches no rows when no connection exists", async () => {
    const { repo, calls } = makeRepo({
      findTrelloConnection: vi.fn(async () => null),
    });
    const createCard = vi.fn();
    const trelloClient: TrelloClientPort = {
      getMember: vi.fn(),
      getBoards: vi.fn(),
      getLists: vi.fn(),
      createCard,
    };
    const useCase = new SyncTasksToTrelloUseCase(repo, trelloClient);

    await expect(
      useCase.execute({
        transcriptId: TRANSCRIPT_ID,
        userId: USER_ID,
        listId: LIST_ID,
      }),
    ).rejects.toThrow(TrelloConnectionNotFoundError);

    expect(createCard).not.toHaveBeenCalled();
    expect(calls.markSynced).not.toHaveBeenCalled();
    expect(calls.updateTranscriptStatus).not.toHaveBeenCalled();
    expect(calls.findDraftTasksByTranscript).not.toHaveBeenCalled();
  });
});
