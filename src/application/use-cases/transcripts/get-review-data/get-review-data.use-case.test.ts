import { describe, expect, it, vi } from "vitest";
import type { TrelloClientPort } from "@/application/ports/trello-client.port";
import { Task } from "@/domain/entities/task.entity";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { GetReviewDataRepository } from "./get-review-data.repository.interface";
import { GetReviewDataUseCase } from "./get-review-data.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";

function makeDraftTask(id: string, title: string): Task {
  return Task.create({
    id,
    transcriptId: TRANSCRIPT_ID,
    userId: USER_ID,
    title,
    description: `Desc for ${title}`,
    dueDate: null,
  });
}

function makeFakeTrelloClient(
  boards: TrelloClientPort["getBoards"],
): TrelloClientPort {
  return {
    getMember: vi.fn(),
    getBoards: vi.fn(boards),
    getLists: vi.fn(),
    createCard: vi.fn(),
  };
}

describe("GetReviewDataUseCase", () => {
  it("returns draft tasks and boards from Trello when a connection exists", async () => {
    const tasks = [
      makeDraftTask("00000000-0000-4000-8000-000000000011", "Task A"),
    ];
    const connection = TrelloConnection.create({
      id: "00000000-0000-4000-8000-000000000002",
      userId: USER_ID,
      trelloMemberId: "member123",
      accessToken: "tok-abc",
    });
    const repository: GetReviewDataRepository = {
      findDraftTasksByTranscript: vi.fn().mockResolvedValue(tasks),
      findTrelloConnection: vi.fn().mockResolvedValue(connection),
    };
    const trelloClient = makeFakeTrelloClient(async () => [
      { id: "board1", name: "Work" },
      { id: "board2", name: "Personal" },
    ]);
    const useCase = new GetReviewDataUseCase(repository, trelloClient);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
    });

    expect(repository.findDraftTasksByTranscript).toHaveBeenCalledWith(
      TRANSCRIPT_ID,
    );
    expect(trelloClient.getBoards).toHaveBeenCalledWith("tok-abc");
    expect(result.tasks).toBe(tasks);
    expect(result.boards).toEqual([
      { id: "board1", name: "Work" },
      { id: "board2", name: "Personal" },
    ]);
  });

  it("returns tasks with empty boards when no Trello connection exists", async () => {
    const tasks = [
      makeDraftTask("00000000-0000-4000-8000-000000000011", "Task A"),
    ];
    const repository: GetReviewDataRepository = {
      findDraftTasksByTranscript: vi.fn().mockResolvedValue(tasks),
      findTrelloConnection: vi.fn().mockResolvedValue(null),
    };
    const trelloClient = makeFakeTrelloClient(async () => []);
    const useCase = new GetReviewDataUseCase(repository, trelloClient);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
    });

    expect(trelloClient.getBoards).not.toHaveBeenCalled();
    expect(result.tasks).toBe(tasks);
    expect(result.boards).toEqual([]);
  });

  it("returns empty tasks and boards for a transcript with no draft tasks and no connection", async () => {
    const repository: GetReviewDataRepository = {
      findDraftTasksByTranscript: vi.fn().mockResolvedValue([]),
      findTrelloConnection: vi.fn().mockResolvedValue(null),
    };
    const trelloClient = makeFakeTrelloClient(async () => []);
    const useCase = new GetReviewDataUseCase(repository, trelloClient);

    const result = await useCase.execute({
      transcriptId: TRANSCRIPT_ID,
      userId: USER_ID,
    });

    expect(result).toEqual({ tasks: [], boards: [] });
  });
});
