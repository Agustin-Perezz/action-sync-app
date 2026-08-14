import { describe, expect, it, vi } from "vitest";
import { Transcript } from "@/domain/entities/transcript.entity";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import { aggregateStatus, toHistoryEntry } from "./get-sync-history.mapping";
import type { GetSyncHistoryRepository } from "./get-sync-history.repository.interface";
import { SYNC_HISTORY_STATUS } from "./get-sync-history.response.dto";
import { GetSyncHistoryUseCase } from "./get-sync-history.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";

function makeTranscript(
  id: string,
  createdAt: string,
  status: string,
  title = `Transcript ${id.slice(-1)}`,
): Transcript {
  return Transcript.create({
    id,
    userId: USER_ID,
    title,
    rawText: "body",
    status:
      status as (typeof TRANSCRIPT_STATUS)[keyof typeof TRANSCRIPT_STATUS],
    createdAt,
  });
}

describe("aggregateStatus", () => {
  it("returns failed for a failed transcript", () => {
    expect(aggregateStatus("failed", { draft: 0, synced: 0 })).toBe(
      SYNC_HISTORY_STATUS.FAILED,
    );
  });

  it("returns pending when there are draft tasks", () => {
    expect(aggregateStatus("completed", { draft: 2, synced: 1 })).toBe(
      SYNC_HISTORY_STATUS.PENDING,
    );
  });

  it("returns pending when status is reviewing", () => {
    expect(aggregateStatus("reviewing", { draft: 0, synced: 0 })).toBe(
      SYNC_HISTORY_STATUS.PENDING,
    );
  });

  it("returns pending when status is processing", () => {
    expect(aggregateStatus("processing", { draft: 0, synced: 0 })).toBe(
      SYNC_HISTORY_STATUS.PENDING,
    );
  });

  it("returns synced when completed and all tasks synced", () => {
    expect(aggregateStatus("completed", { draft: 0, synced: 3 })).toBe(
      SYNC_HISTORY_STATUS.SYNCED,
    );
  });

  it("returns synced when completed with zero tasks", () => {
    expect(aggregateStatus("completed", { draft: 0, synced: 0 })).toBe(
      SYNC_HISTORY_STATUS.SYNCED,
    );
  });
});

describe("toHistoryEntry", () => {
  it("maps a transcript with counts to a history entry", () => {
    const entry = toHistoryEntry(
      {
        id: "t1",
        title: "Standup",
        createdAt: "2026-01-01T00:00:00.000Z",
        status: "completed",
      },
      { draft: 0, synced: 4 },
    );
    expect(entry).toEqual({
      id: "t1",
      title: "Standup",
      taskCount: 4,
      board: "",
      list: "",
      timestamp: "2026-01-01T00:00:00.000Z",
      status: SYNC_HISTORY_STATUS.SYNCED,
    });
  });
});

describe("GetSyncHistoryUseCase", () => {
  it("maps repo-returned transcripts to history entries in order", async () => {
    const transcripts = [
      makeTranscript(
        "00000000-0000-4000-8000-000000000002",
        "2026-02-01T00:00:00.000Z",
        TRANSCRIPT_STATUS.COMPLETED,
        "Newer",
      ),
      makeTranscript(
        "00000000-0000-4000-8000-000000000001",
        "2026-01-01T00:00:00.000Z",
        TRANSCRIPT_STATUS.REVIEWING,
        "Older",
      ),
    ];
    const counts = new Map([
      ["00000000-0000-4000-8000-000000000001", { draft: 2, synced: 0 }],
      ["00000000-0000-4000-8000-000000000002", { draft: 0, synced: 3 }],
    ]);
    const repository: GetSyncHistoryRepository = {
      findTranscriptsByUserId: vi.fn().mockResolvedValue(transcripts),
      countTasksByUserTranscripts: vi.fn().mockResolvedValue(counts),
    };
    const useCase = new GetSyncHistoryUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("00000000-0000-4000-8000-000000000002");
    expect(result[1].id).toBe("00000000-0000-4000-8000-000000000001");
    expect(result[0]).toEqual({
      id: "00000000-0000-4000-8000-000000000002",
      title: "Newer",
      taskCount: 3,
      board: "",
      list: "",
      timestamp: "2026-02-01T00:00:00.000Z",
      status: SYNC_HISTORY_STATUS.SYNCED,
    });
    expect(result[1].status).toBe(SYNC_HISTORY_STATUS.PENDING);
    expect(result[1].taskCount).toBe(2);
  });

  it("returns an empty array when the user has no transcripts", async () => {
    const repository: GetSyncHistoryRepository = {
      findTranscriptsByUserId: vi.fn().mockResolvedValue([]),
      countTasksByUserTranscripts: vi.fn().mockResolvedValue(new Map()),
    };
    const useCase = new GetSyncHistoryUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(result).toEqual([]);
  });

  it("marks a zero-task completed transcript as synced", async () => {
    const transcripts = [
      makeTranscript(
        "00000000-0000-4000-8000-000000000003",
        "2026-01-01T00:00:00.000Z",
        TRANSCRIPT_STATUS.COMPLETED,
        "Empty",
      ),
    ];
    const repository: GetSyncHistoryRepository = {
      findTranscriptsByUserId: vi.fn().mockResolvedValue(transcripts),
      countTasksByUserTranscripts: vi.fn().mockResolvedValue(new Map()),
    };
    const useCase = new GetSyncHistoryUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(result[0].status).toBe(SYNC_HISTORY_STATUS.SYNCED);
    expect(result[0].taskCount).toBe(0);
  });

  it("marks a failed transcript as failed", async () => {
    const transcripts = [
      makeTranscript(
        "00000000-0000-4000-8000-000000000004",
        "2026-01-01T00:00:00.000Z",
        TRANSCRIPT_STATUS.FAILED,
        "Failed run",
      ),
    ];
    const repository: GetSyncHistoryRepository = {
      findTranscriptsByUserId: vi.fn().mockResolvedValue(transcripts),
      countTasksByUserTranscripts: vi.fn().mockResolvedValue(new Map()),
    };
    const useCase = new GetSyncHistoryUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(result[0].status).toBe(SYNC_HISTORY_STATUS.FAILED);
  });
});
